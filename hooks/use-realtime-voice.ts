"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  appendTranscriptDelta,
  extractTranscriptFromEvent,
  isAssistantTurnComplete,
  isUserSpeechCommitted,
  type TranscriptLine,
} from "@/lib/realtime/parse-realtime-event";
import {
  attachRemoteAudio,
  cleanupPeerConnection,
  createCancelResponseEvent,
  createSessionUpdateEvent,
} from "@/lib/realtime/realtime-webrtc-utils";

export type RealtimeVoiceStatus = "idle" | "connecting" | "connected" | "error";

export type RealtimeInstructionContext = {
  currentItemId: string;
  turnsOnNode: number;
};

type UseRealtimeVoiceOptions = {
  onAssistantTurnComplete?: () => void | Promise<void>;
  getInstructionContext?: () => RealtimeInstructionContext | null;
};

export function useRealtimeVoice(sessionId: string | null, options: UseRealtimeVoiceOptions = {}) {
  const onTurnCompleteRef = useRef(options.onAssistantTurnComplete);
  const getInstructionContextRef = useRef(options.getInstructionContext);
  const refreshInstructionsRef = useRef<(() => Promise<void>) | null>(null);
  const userSpokeSinceLastAdvanceRef = useRef(false);
  const turnCompleteLockRef = useRef(false);
  const connectingRef = useRef(false);

  useEffect(() => {
    onTurnCompleteRef.current = options.onAssistantTurnComplete;
    getInstructionContextRef.current = options.getInstructionContext;
  }, [options.onAssistantTurnComplete, options.getInstructionContext]);

  const [status, setStatus] = useState<RealtimeVoiceStatus>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const disconnect = useCallback(() => {
    connectingRef.current = false;
    cleanupPeerConnection(pcRef.current, streamRef.current, audioRef.current);
    pcRef.current = null;
    dcRef.current = null;
    streamRef.current = null;
    setStatus("idle");
  }, []);

  useEffect(() => disconnect, [disconnect]);

  const refreshInstructions = useCallback(async () => {
    if (!sessionId || !dcRef.current || dcRef.current.readyState !== "open") {
      return;
    }

    const instructionContext = getInstructionContextRef.current?.();
    const params = new URLSearchParams({ sessionId });
    if (instructionContext) {
      params.set("currentItemId", instructionContext.currentItemId);
      params.set("turnsOnNode", String(instructionContext.turnsOnNode));
    }

    const response = await fetch(`/api/realtime/instructions?${params.toString()}`);
    const payload = (await response.json()) as { instructions?: string; error?: string };
    if (!response.ok || !payload.instructions) {
      return;
    }

    dcRef.current.send(JSON.stringify(createCancelResponseEvent()));
    dcRef.current.send(JSON.stringify(createSessionUpdateEvent(payload.instructions)));
  }, [sessionId]);

  useEffect(() => {
    refreshInstructionsRef.current = refreshInstructions;
  }, [refreshInstructions]);

  const handleAssistantTurnComplete = useCallback(async () => {
    if (turnCompleteLockRef.current) {
      return;
    }

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
  }, []);

  const connect = useCallback(async () => {
    if (!sessionId || connectingRef.current || pcRef.current) {
      return;
    }

    connectingRef.current = true;
    setError(null);
    setStatus("connecting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

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

          if (isUserSpeechCommitted(event)) {
            userSpokeSinceLastAdvanceRef.current = true;
          }

          if (isAssistantTurnComplete(event)) {
            void handleAssistantTurnComplete();
          }

          const parts = extractTranscriptFromEvent(event);
          if (parts.length === 0) {
            return;
          }

          if (parts.some((part) => part.role === "user")) {
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
        },
        body: offer.sdp,
      });

      if (!sdpResponse.ok) {
        const payload = (await sdpResponse.json()) as { error?: string };
        throw new Error(payload.error ?? "Could not connect voice.");
      }

      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });
      setStatus("connected");
    } catch (connectError) {
      disconnect();
      setStatus("error");
      setError(connectError instanceof Error ? connectError.message : "Voice connection failed.");
    } finally {
      connectingRef.current = false;
    }
  }, [disconnect, handleAssistantTurnComplete, sessionId]);

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
  };
}
