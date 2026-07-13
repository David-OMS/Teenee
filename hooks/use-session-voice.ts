"use client";

import { useBudgetVoice } from "@/hooks/use-budget-voice";
import { useRealtimeVoice } from "@/hooks/use-realtime-voice";
import { useVoicePipelineMode } from "@/hooks/use-voice-pipeline-mode";
import type { RealtimeInstructionContext } from "@/hooks/use-realtime-voice";
import type { VoiceInputMode } from "@/types/conversation/voice-input-mode";
import type { VoicePipelineMode } from "@/types/conversation/voice-pipeline-mode";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";

export type SessionVoiceStatus =
  | "idle"
  | "ready"
  | "connecting"
  | "connected"
  | "recording"
  | "processing"
  | "speaking"
  | "error";

type UseSessionVoiceOptions = {
  contextReady?: boolean;
  voiceInputMode?: VoiceInputMode;
  silenceTimeoutSeconds?: number;
  onAssistantTurnComplete?: () => void | Promise<void>;
  getInstructionContext?: () => RealtimeInstructionContext | null;
};

export function useSessionVoice(sessionId: string | null, options: UseSessionVoiceOptions = {}) {
  const { mode: pipelineMode } = useVoicePipelineMode();

  const realtime = useRealtimeVoice(
    sessionId && pipelineMode === "realtime" ? sessionId : null,
    options,
  );
  const budget = useBudgetVoice(sessionId && pipelineMode === "budget" ? sessionId : null, {
    contextReady: options.contextReady,
    onAssistantTurnComplete: options.onAssistantTurnComplete,
    getInstructionContext: options.getInstructionContext,
  });

  const active = pipelineMode === "budget" ? budget : realtime;

  return {
    ...active,
    pipelineMode: pipelineMode as VoicePipelineMode,
    status: active.status as SessionVoiceStatus,
    transcript: active.transcript as TranscriptLine[],
    needsStart: "needsStart" in active ? Boolean(active.needsStart) : false,
    toggleTalk: "toggleTalk" in active ? active.toggleTalk : undefined,
    startSession: "startSession" in active ? active.startSession : undefined,
  };
}
