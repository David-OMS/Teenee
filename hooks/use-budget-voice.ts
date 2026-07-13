"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { unlockAudioPlayback } from "@/lib/audio/unlock-audio-playback";
import { createAudioAnalyser } from "@/lib/audio/create-audio-analyser";
import { readAudioLevels } from "@/lib/audio/read-audio-levels";
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

const MIC_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

async function playAudioBase64(audioBase64: string, mimeType: string): Promise<void> {
  const audio = new Audio(`data:${mimeType};base64,${audioBase64}`);
  await new Promise<void>((resolve, reject) => {
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error("Could not play Teenee's response."));
    void audio.play().catch(reject);
  });
}

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

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const frameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const openedRef = useRef(false);
  const transcriptRef = useRef<TranscriptLine[]>([]);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  const stopVisualizer = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const stopRecorderOnly = useCallback(() => {
    stopVisualizer();
    recorderRef.current = null;
    setIsRecording(false);
  }, [stopVisualizer]);

  const cleanupAll = useCallback(() => {
    stopRecorderOnly();
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    stopMediaStream(streamRef.current);
    streamRef.current = null;
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
      try {
        await playAudioBase64(payload.audioBase64, payload.mimeType);
      } catch (playError) {
        appendTurn(payload.userText, payload.assistantText);
        setStatus("connected");
        setError(
          playError instanceof Error
            ? playError.message
            : "Could not play audio. Tap Talk again to continue.",
        );
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

  const ensureMicStream = useCallback(async (): Promise<MediaStream> => {
    if (streamRef.current?.active) {
      return streamRef.current;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: MIC_CONSTRAINTS });
    streamRef.current = stream;

    const { audioContext, analyser } = createAudioAnalyser(stream);
    audioContextRef.current = audioContext;

    const tick = () => {
      readAudioLevels(analyser);
      frameRef.current = requestAnimationFrame(tick);
    };
    tick();

    return stream;
  }, []);

  const openSession = useCallback(async () => {
    if (!sessionId || openedRef.current) {
      return;
    }

    const generation = sessionGenerationRef.current;
    setError(null);
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
      formData.set("audio", audioBlob, "turn.webm");
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

  /** First tap — unlock audio, mic permission, Teenee opening line. Must run from click handler. */
  const startSession = useCallback(async () => {
    if (!sessionId || status === "processing" || status === "speaking" || status === "connecting") {
      return;
    }

    unlockAudioPlayback();
    setError(null);

    try {
      await ensureMicStream();

      if (!openedRef.current) {
        await openSession();
        return;
      }

      setStatus("connected");
    } catch (startError) {
      setStatus("ready");
      const message =
        startError instanceof Error ? startError.message : "Microphone access is required.";
      if (message.toLowerCase().includes("not allowed")) {
        setError("Tap Start to allow microphone access.");
      } else {
        setError(message);
      }
    }
  }, [ensureMicStream, openSession, sessionId, status]);

  const startRecording = useCallback(async () => {
    if (
      !sessionId ||
      isRecording ||
      status === "processing" ||
      status === "speaking" ||
      status === "connecting"
    ) {
      return;
    }

    unlockAudioPlayback();
    setError(null);

    try {
      const stream = await ensureMicStream();

      if (!openedRef.current) {
        await openSession();
        if (!openedRef.current) {
          return;
        }
      }

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopRecorderOnly();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });

        if (blob.size > 0) {
          void submitTurn(blob);
        } else {
          setStatus("connected");
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setStatus("recording");
    } catch (recordError) {
      stopRecorderOnly();
      setStatus(openedRef.current ? "connected" : "ready");
      const message =
        recordError instanceof Error ? recordError.message : "Microphone access is required.";
      if (message.toLowerCase().includes("not allowed")) {
        setError("Tap Talk to allow microphone access.");
      } else {
        setError(message);
      }
    }
  }, [ensureMicStream, isRecording, openSession, sessionId, status, stopRecorderOnly, submitTurn]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  /** Tap once to start, tap again to stop and send. */
  const toggleTalk = useCallback(() => {
    if (status === "ready" || status === "idle") {
      void startSession();
      return;
    }

    if (isRecording) {
      stopRecording();
      return;
    }

    void startRecording();
  }, [isRecording, startRecording, startSession, status, stopRecording]);

  return {
    status,
    transcript,
    error,
    disconnect,
    refreshInstructions: async () => undefined,
    commitUserTurn: stopRecording,
    startPushToTalk: startRecording,
    stopPushToTalk: stopRecording,
    toggleTalk,
    startSession,
    isPushToTalkActive: isRecording,
    needsStart: status === "ready" || status === "idle",
    voiceInputMode: "tap_to_talk" as const,
  };
}
