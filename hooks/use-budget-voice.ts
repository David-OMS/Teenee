"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createAudioAnalyser } from "@/lib/audio/create-audio-analyser";
import { readAudioLevels } from "@/lib/audio/read-audio-levels";
import { stopMediaStream } from "@/lib/audio/stop-media-stream";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";

export type BudgetVoiceStatus =
  | "idle"
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

  const stopVisualizer = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const cleanupRecording = useCallback(() => {
    stopVisualizer();
    recorderRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    setIsRecording(false);
  }, [stopVisualizer]);

  const disconnect = useCallback(() => {
    sessionGenerationRef.current += 1;
    cleanupRecording();
    openedRef.current = false;
    setStatus("idle");
  }, [cleanupRecording]);

  useEffect(() => disconnect, [disconnect]);

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
      await playAudioBase64(payload.audioBase64, payload.mimeType);
      appendTurn(payload.userText, payload.assistantText);

      if (advanceAfter && payload.userText?.trim()) {
        await onTurnCompleteRef.current?.();
      }

      setStatus("connected");
    },
    [appendTurn],
  );

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
        setStatus("error");
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
      formData.set("history", JSON.stringify(transcript));
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
    [handleBudgetResponse, sessionId, transcript],
  );

  const startPushToTalk = useCallback(async () => {
    if (!sessionId || isRecording || status === "processing" || status === "speaking") {
      return;
    }

    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const { audioContext, analyser } = createAudioAnalyser(stream);
      audioContextRef.current = audioContext;

      const tick = () => {
        readAudioLevels(analyser);
        frameRef.current = requestAnimationFrame(tick);
      };
      tick();

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopVisualizer();
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        stopMediaStream(streamRef.current);
        streamRef.current = null;
        setIsRecording(false);

        if (blob.size > 0) {
          void submitTurn(blob);
        } else {
          setStatus("connected");
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setStatus("recording");
    } catch {
      cleanupRecording();
      setStatus("connected");
      setError("Microphone access is required.");
    }
  }, [cleanupRecording, isRecording, sessionId, status, stopVisualizer, submitTurn]);

  const stopPushToTalk = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  useEffect(() => {
    if (!sessionId || !contextReady) {
      return;
    }

    void openSession();

    return () => {
      disconnect();
    };
  }, [contextReady, disconnect, openSession, sessionId]);

  return {
    status,
    transcript,
    error,
    disconnect,
    refreshInstructions: async () => undefined,
    commitUserTurn: stopPushToTalk,
    startPushToTalk,
    stopPushToTalk,
    isPushToTalkActive: isRecording,
    voiceInputMode: "push_to_talk" as const,
  };
}
