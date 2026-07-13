"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  attachMicAnalyser,
  closeSessionMedia,
  extensionForMimeType,
  pickRecorderMimeType,
  playMp3Base64,
} from "@/lib/audio/session-media";
import { stopMediaStream } from "@/lib/audio/stop-media-stream";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";

export type BudgetVoiceStatus =
  | "idle"
  | "ready"
  | "connecting"
  | "connected"
  | "recording"
  | "processing"
  | "speaking"
  | "error";

export type BudgetInstructionContext = {
  currentItemId: string;
  turnsOnNode: number;
  promptOverride?: string;
};

type UseBudgetVoiceOptions = {
  contextReady?: boolean;
  onAssistantTurnComplete?: () => void | Promise<void>;
  getInstructionContext?: () => BudgetInstructionContext | null;
};

type BudgetVoiceResponse = {
  userText: string | null;
  assistantText: string;
  audioBase64: string;
  mimeType: string;
};

export function useBudgetVoice(sessionId: string | null, options: UseBudgetVoiceOptions = {}) {
  const contextReady = options.contextReady ?? true;
  const onTurnCompleteRef = useRef(options.onAssistantTurnComplete);
  const getInstructionContextRef = useRef(options.getInstructionContext);
  const sessionGenerationRef = useRef(0);

  useEffect(() => {
    onTurnCompleteRef.current = options.onAssistantTurnComplete;
    getInstructionContextRef.current = options.getInstructionContext;
  }, [options.onAssistantTurnComplete, options.getInstructionContext]);

  const [status, setStatus] = useState<BudgetVoiceStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [lastAssistantText, setLastAssistantText] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recorderMimeRef = useRef<string>("audio/webm");
  const chunksRef = useRef<Blob[]>([]);
  const stopAnalyserRef = useRef<(() => void) | null>(null);
  const openedRef = useRef(false);
  const transcriptRef = useRef<TranscriptLine[]>([]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const stopRecorderOnly = useCallback(() => {
    recorderRef.current = null;
    setIsRecording(false);
  }, []);

  const cleanupAll = useCallback(() => {
    stopRecorderOnly();
    stopAnalyserRef.current?.();
    stopAnalyserRef.current = null;
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    closeSessionMedia();
  }, [stopRecorderOnly]);

  const disconnect = useCallback(() => {
    sessionGenerationRef.current += 1;
    cleanupAll();
    openedRef.current = false;
    setStatus("idle");
  }, [cleanupAll]);

  useEffect(() => disconnect, [disconnect]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    if (contextReady) {
      setStatus("ready");
      setError(null);
    }

    return () => {
      disconnect();
    };
  }, [contextReady, disconnect, sessionId]);

  const appendTurn = useCallback((userText: string | null, assistantText: string) => {
    setLastAssistantText(assistantText.trim());
    setTranscript((current) => {
      let next = current;
      if (userText?.trim()) {
        next = [...next, { role: "user", text: userText.trim() }];
      }
      next = [...next, { role: "assistant", text: assistantText.trim() }];
      return next;
    });
  }, []);

  const handleBudgetResponse = useCallback(
    async (payload: BudgetVoiceResponse, advanceAfter: boolean) => {
      setStatus("speaking");
      setLastAssistantText(payload.assistantText.trim());
      setError(null);

      try {
        await playMp3Base64(payload.audioBase64);
      } catch {
        appendTurn(payload.userText, payload.assistantText);
        setStatus("connected");
        setError(null);
        return;
      }

      appendTurn(payload.userText, payload.assistantText);

      if (advanceAfter && payload.userText?.trim()) {
        await onTurnCompleteRef.current?.();
      }

      setStatus("connected");
    },
    [appendTurn],
  );

  const bindMicStream = useCallback(async (micPromise: Promise<MediaStream>): Promise<MediaStream> => {
    if (streamRef.current?.active) {
      return streamRef.current;
    }

    const stream = await micPromise;
    streamRef.current = stream;
    stopAnalyserRef.current?.();
    stopAnalyserRef.current = attachMicAnalyser(stream, () => {
      // Levels consumed by waveform via recording state.
    });

    return stream;
  }, []);

  const openSession = useCallback(async () => {
    if (!sessionId || openedRef.current) {
      return;
    }

    const generation = sessionGenerationRef.current;
    setStatus("connecting");

    const instructionContext = getInstructionContextRef.current?.();

    try {
      const response = await fetch("/api/voice/open", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          currentItemId: instructionContext?.currentItemId,
          turnsOnNode: instructionContext?.turnsOnNode,
          promptOverride: instructionContext?.promptOverride,
        }),
      });

      const payload = (await response.json()) as BudgetVoiceResponse & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not start budget voice.");
      }

      if (generation !== sessionGenerationRef.current) {
        return;
      }

      openedRef.current = true;
      await handleBudgetResponse(payload, false);
    } catch (openError) {
      if (generation === sessionGenerationRef.current) {
        setStatus("ready");
        setError(openError instanceof Error ? openError.message : "Budget voice failed.");
      }
    }
  }, [handleBudgetResponse, sessionId]);

  const submitTurn = useCallback(
    async (audioBlob: Blob) => {
      if (!sessionId) {
        return;
      }

      const generation = sessionGenerationRef.current;
      setStatus("processing");
      setError(null);

      const instructionContext = getInstructionContextRef.current?.();
      const formData = new FormData();
      formData.set("sessionId", sessionId);
      formData.set("audio", audioBlob, `turn.${extensionForMimeType(recorderMimeRef.current)}`);
      formData.set("history", JSON.stringify(transcriptRef.current));
      if (instructionContext) {
        formData.set("currentItemId", instructionContext.currentItemId);
        formData.set("turnsOnNode", String(instructionContext.turnsOnNode));
        if (instructionContext.promptOverride?.trim()) {
          formData.set("promptOverride", instructionContext.promptOverride.trim());
        }
      }

      try {
        const response = await fetch("/api/voice/turn", {
          method: "POST",
          body: formData,
        });

        const payload = (await response.json()) as BudgetVoiceResponse & { error?: string };
        if (!response.ok) {
          throw new Error(payload.error ?? "Could not process your turn.");
        }

        if (generation !== sessionGenerationRef.current) {
          return;
        }

        await handleBudgetResponse(payload, true);
      } catch (turnError) {
        if (generation === sessionGenerationRef.current) {
          setStatus("connected");
          setError(turnError instanceof Error ? turnError.message : "Turn failed.");
        }
      }
    },
    [handleBudgetResponse, sessionId],
  );

  const startRecordingOnStream = useCallback(
    (stream: MediaStream) => {
      const mimeType = pickRecorderMimeType();
      recorderMimeRef.current = mimeType ?? "audio/webm";
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopRecorderOnly();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || recorderMimeRef.current });

        if (blob.size > 0) {
          void submitTurn(blob);
        } else {
          setStatus("connected");
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setStatus("recording");
    },
    [stopRecorderOnly, submitTurn],
  );

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  const startSession = useCallback(
    (micPromise: Promise<MediaStream>) => {
      if (!sessionId || status === "processing" || status === "speaking" || status === "connecting") {
        return;
      }

      setError(null);

      void (async () => {
        try {
          await bindMicStream(micPromise);
          if (!openedRef.current) {
            await openSession();
          } else {
            setStatus("connected");
          }
        } catch (beginError) {
          setStatus("ready");
          const message = beginError instanceof Error ? beginError.message : "Microphone access failed.";
          setError(
            message.toLowerCase().includes("not allowed") || message.toLowerCase().includes("permission")
              ? "Allow microphone in browser settings, then tap Start again."
              : message,
          );
        }
      })();
    },
    [bindMicStream, openSession, sessionId, status],
  );

  const toggleTalk = useCallback(
    (micPromise: Promise<MediaStream>) => {
      if (isRecording) {
        stopRecording();
        return;
      }

      if (!sessionId || status === "processing" || status === "speaking" || status === "connecting") {
        return;
      }

      setError(null);

      void (async () => {
        try {
          const stream = await bindMicStream(micPromise);

          if (!openedRef.current) {
            await openSession();
          }

          startRecordingOnStream(stream);
        } catch (beginError) {
          setStatus(openedRef.current ? "connected" : "ready");
          const message = beginError instanceof Error ? beginError.message : "Microphone access failed.";
          setError(
            message.toLowerCase().includes("not allowed") || message.toLowerCase().includes("permission")
              ? "Allow microphone in browser settings, then tap Talk again."
              : message,
          );
        }
      })();
    },
    [bindMicStream, isRecording, openSession, sessionId, startRecordingOnStream, status, stopRecording],
  );

  return {
    status,
    transcript,
    error,
    lastAssistantText,
    disconnect,
    refreshInstructions: async () => undefined,
    commitUserTurn: stopRecording,
    stopPushToTalk: stopRecording,
    toggleTalk,
    startSession,
    isPushToTalkActive: isRecording,
    needsStart: status === "ready" || status === "idle",
    voiceInputMode: "tap_to_talk" as const,
  };
}
