"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  appendTranscriptDelta,
  extractTranscriptFromEvent,
  isAssistantResponseStarted,
  isAssistantTurnComplete,
  isUserSpeechCommitted,
  type TranscriptLine,
} from "@/lib/realtime/parse-realtime-event";
import {
  attachRemoteAudio,
  cleanupPeerConnection,
  createCancelResponseEvent,
  createClearInputBufferEvent,
  createCommitInputBufferEvent,
  createResponseCreateEvent,
  createSessionUpdateEvent,
  setMicrophoneEnabled,
} from "@/lib/realtime/realtime-webrtc-utils";
import type { VoiceInputMode } from "@/types/conversation/voice-input-mode";

export type RealtimeVoiceStatus = "idle" | "connecting" | "connected" | "error";

export type RealtimeInstructionContext = {
  currentItemId: string;
  turnsOnNode: number;
  promptOverride?: string;
};

type UseRealtimeVoiceOptions = {
  voiceInputMode?: VoiceInputMode;
  silenceTimeoutSeconds?: number;
  onAssistantTurnComplete?: () => void | Promise<void>;
  getInstructionContext?: () => RealtimeInstructionContext | null;
};

function sendDataChannelEvent(dc: RTCDataChannel, event: Record<string, unknown>) {
  if (dc.readyState !== "open") {
    return;
  }

  dc.send(JSON.stringify(event));
}

export function useRealtimeVoice(sessionId: string | null, options: UseRealtimeVoiceOptions = {}) {
  const voiceInputMode = options.voiceInputMode ?? "auto";
  const silenceTimeoutSeconds = options.silenceTimeoutSeconds ?? 2;

  const onTurnCompleteRef = useRef(options.onAssistantTurnComplete);
  const getInstructionContextRef = useRef(options.getInstructionContext);
  const refreshInstructionsRef = useRef<(() => Promise<void>) | null>(null);
  const userSpokeSinceLastAdvanceRef = useRef(false);
  const turnCompleteLockRef = useRef(false);
  const connectingRef = useRef(false);
  const assistantSpeakingRef = useRef(false);
  const responseInFlightRef = useRef(false);
  const sessionGenerationRef = useRef(0);

  useEffect(() => {
    onTurnCompleteRef.current = options.onAssistantTurnComplete;
    getInstructionContextRef.current = options.getInstructionContext;
  }, [options.onAssistantTurnComplete, options.getInstructionContext]);

  const [status, setStatus] = useState<RealtimeVoiceStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const beginAssistantSpeech = useCallback(() => {
    assistantSpeakingRef.current = true;
    responseInFlightRef.current = true;
    setMicrophoneEnabled(streamRef.current, false);

    const dc = dcRef.current;
    if (dc) {
      sendDataChannelEvent(dc, createClearInputBufferEvent());
    }
  }, []);

  const endAssistantSpeech = useCallback(() => {
    assistantSpeakingRef.current = false;
    responseInFlightRef.current = false;

    window.setTimeout(() => {
      if (assistantSpeakingRef.current) {
        return;
      }

      const dc = dcRef.current;
      if (dc) {
        sendDataChannelEvent(dc, createClearInputBufferEvent());
      }

      if (voiceInputMode === "auto") {
        setMicrophoneEnabled(streamRef.current, true);
      }
    }, 350);
  }, [voiceInputMode]);

  const disconnect = useCallback(() => {
    sessionGenerationRef.current += 1;
    connectingRef.current = false;
    assistantSpeakingRef.current = false;
    responseInFlightRef.current = false;
    cleanupPeerConnection(pcRef.current, streamRef.current, audioRef.current);
    pcRef.current = null;
    dcRef.current = null;
    streamRef.current = null;
    setIsPushToTalkActive(false);
    setStatus("idle");
  }, []);

  useEffect(() => disconnect, [disconnect]);

  const refreshInstructions = useCallback(async () => {
    if (!sessionId || !dcRef.current || dcRef.current.readyState !== "open") {
      return;
    }

    if (responseInFlightRef.current) {
      return;
    }

    const instructionContext = getInstructionContextRef.current?.();
    const params = new URLSearchParams({ sessionId });
    if (instructionContext) {
      params.set("currentItemId", instructionContext.currentItemId);
      params.set("turnsOnNode", String(instructionContext.turnsOnNode));
      if (instructionContext.promptOverride?.trim()) {
        params.set("promptOverride", instructionContext.promptOverride.trim());
      }
    }

    const response = await fetch(`/api/realtime/instructions?${params.toString()}`);
    const payload = (await response.json()) as { instructions?: string; error?: string };
    if (!response.ok || !payload.instructions) {
      return;
    }

    const dc = dcRef.current;
    sendDataChannelEvent(dc, createCancelResponseEvent());
    sendDataChannelEvent(
      dc,
      createSessionUpdateEvent(payload.instructions, {
        voiceInputMode,
        silenceTimeoutSeconds,
      }),
    );
  }, [sessionId, silenceTimeoutSeconds, voiceInputMode]);

  useEffect(() => {
    refreshInstructionsRef.current = refreshInstructions;
  }, [refreshInstructions]);

  const handleAssistantTurnComplete = useCallback(async () => {
    if (turnCompleteLockRef.current) {
      return;
    }

    endAssistantSpeech();

    if (!userSpokeSinceLastAdvanceRef.current) {
      return;
    }

    turnCompleteLockRef.current = true;
    userSpokeSinceLastAdvanceRef.current = false;

    try {
      await onTurnCompleteRef.current?.();
      await refreshInstructionsRef.current?.();
    } finally {
      window.setTimeout(() => {
        turnCompleteLockRef.current = false;
      }, 1200);
    }
  }, [endAssistantSpeech]);

  const commitUserTurn = useCallback(() => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open" || assistantSpeakingRef.current) {
      return;
    }

    userSpokeSinceLastAdvanceRef.current = true;
    sendDataChannelEvent(dc, createCommitInputBufferEvent());

    if (voiceInputMode === "push_to_talk") {
      sendDataChannelEvent(dc, createResponseCreateEvent());
      setIsPushToTalkActive(false);
      setMicrophoneEnabled(streamRef.current, false);
    }
  }, [voiceInputMode]);

  const startPushToTalk = useCallback(() => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open" || assistantSpeakingRef.current) {
      return;
    }

    setIsPushToTalkActive(true);
    setMicrophoneEnabled(streamRef.current, true);
    sendDataChannelEvent(dc, createClearInputBufferEvent());
  }, []);

  const stopPushToTalk = useCallback(() => {
    if (!isPushToTalkActive) {
      return;
    }

    commitUserTurn();
  }, [commitUserTurn, isPushToTalkActive]);

  const connect = useCallback(async () => {
    if (!sessionId || connectingRef.current || pcRef.current) {
      return;
    }

    const generation = sessionGenerationRef.current + 1;
    sessionGenerationRef.current = generation;
    connectingRef.current = true;
    setError(null);
    setStatus("connecting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      if (voiceInputMode === "push_to_talk") {
        setMicrophoneEnabled(stream, false);
      }

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      const audioElement = audioRef.current ?? new Audio();
      audioElement.autoplay = true;
      audioRef.current = audioElement;
      attachRemoteAudio(pc, audioElement);

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;
      dc.addEventListener("message", (messageEvent) => {
        try {
          const event = JSON.parse(String(messageEvent.data)) as Record<string, unknown>;

          if (isAssistantResponseStarted(event)) {
            beginAssistantSpeech();
          }

          if (isUserSpeechCommitted(event)) {
            if (!assistantSpeakingRef.current) {
              userSpokeSinceLastAdvanceRef.current = true;
            }
          }

          if (isAssistantTurnComplete(event)) {
            void handleAssistantTurnComplete();
          }

          const parts = extractTranscriptFromEvent(event);
          if (parts.length === 0) {
            return;
          }

          if (parts.some((part) => part.role === "user") && !assistantSpeakingRef.current) {
            userSpokeSinceLastAdvanceRef.current = true;
          }

          setTranscript((current) => {
            let next = current;
            for (const part of parts) {
              next = appendTranscriptDelta(next, part.role, part.text);
            }
            return next;
          });
        } catch {
          // Ignore malformed events.
        }
      });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpResponse = await fetch("/api/realtime/connect", {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp",
          "x-teenee-session-id": sessionId,
          "x-teenee-voice-input-mode": voiceInputMode,
        },
        body: offer.sdp,
      });

      if (generation !== sessionGenerationRef.current) {
        return;
      }

      if (!sdpResponse.ok) {
        const payload = (await sdpResponse.json()) as { error?: string };
        throw new Error(payload.error ?? "Could not connect voice.");
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      setStatus("connected");
    } catch (connectError) {
      if (generation === sessionGenerationRef.current) {
        disconnect();
        setStatus("error");
        setError(connectError instanceof Error ? connectError.message : "Voice connection failed.");
      }
    } finally {
      if (generation === sessionGenerationRef.current) {
        connectingRef.current = false;
      }
    }
  }, [beginAssistantSpeech, disconnect, handleAssistantTurnComplete, sessionId, voiceInputMode]);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    void connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect, sessionId]);

  return {
    status,
    transcript,
    error,
    connect,
    disconnect,
    refreshInstructions,
    commitUserTurn,
    startPushToTalk,
    stopPushToTalk,
    isPushToTalkActive,
    voiceInputMode,
  };
}
