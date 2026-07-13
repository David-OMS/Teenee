"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AudioWaveform } from "@/components/dump/AudioWaveform";
import { prepareSessionMedia } from "@/lib/audio/session-media";
import { useSessionVoice } from "@/hooks/use-session-voice";
import { useVoiceInputMode } from "@/hooks/use-voice-input-mode";
import { useVoicePipelineMode } from "@/hooks/use-voice-pipeline-mode";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";
import type { SessionPhase } from "@/types/session/session-phase";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

type VoiceSessionStageProps = {
  sessionId: string;
  lessonTitle: string;
  phase: SessionPhase;
  context: TurnContextSlice | null;
  showTranscript: boolean;
  silenceTimeoutSeconds?: number;
  onEnd: () => void;
  reviewOnEnd?: boolean;
  onTurnComplete?: () => Promise<void>;
  secondaryAction?: {
    label: string;
    onClick: () => void;
    disabled?: boolean;
  };
};

function formatTranscriptSummary(lines: TranscriptLine[]): string {
  return lines.map((line) => `${line.role}: ${line.text}`).join("\n").slice(0, 4000);
}

export function VoiceSessionStage({
  sessionId,
  lessonTitle,
  phase,
  context,
  showTranscript,
  silenceTimeoutSeconds = 2,
  onEnd,
  reviewOnEnd = false,
  onTurnComplete,
  secondaryAction,
}: VoiceSessionStageProps) {
  const router = useRouter();
  const { mode: voiceInputMode } = useVoiceInputMode();
  const { mode: pipelineMode } = useVoicePipelineMode();
  const startedAtRef = useRef<number>(Date.now());
  const contextRef = useRef(context);
  contextRef.current = context;
  const promptOverrideRef = useRef("");
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptDraft, setPromptDraft] = useState("");
  const [isEnding, setIsEnding] = useState(false);
  const [isApplyingPrompt, setIsApplyingPrompt] = useState(false);

  const getInstructionContext = useCallback(
    () =>
      contextRef.current
        ? {
            currentItemId: contextRef.current.currentItem.id,
            turnsOnNode: contextRef.current.turnsOnNode,
            promptOverride: promptOverrideRef.current,
          }
        : null,
    [],
  );

  const {
    status,
    transcript,
    error,
    disconnect,
    refreshInstructions,
    commitUserTurn,
    stopPushToTalk,
    toggleTalk,
    startSession,
    isPushToTalkActive,
    needsStart,
    lastAssistantText,
    startPushToTalk,
  } = useSessionVoice(sessionId, {
    contextReady: Boolean(context?.currentItem.id),
    voiceInputMode,
    silenceTimeoutSeconds,
    onAssistantTurnComplete: onTurnComplete,
    getInstructionContext,
  });

  async function handleApplyPrompt() {
    promptOverrideRef.current = promptDraft.trim();
    setIsApplyingPrompt(true);
    try {
      if (pipelineMode === "realtime") {
        await refreshInstructions();
      }
    } finally {
      setIsApplyingPrompt(false);
    }
  }

  async function handleEnd() {
    setIsEnding(true);
    disconnect();

    try {
      const response = await fetch("/api/session/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          durationSeconds: Math.floor((Date.now() - startedAtRef.current) / 1000),
          transcriptSummary: formatTranscriptSummary(transcript),
          nodesCovered: context ? [context.currentItem.id] : [],
        }),
      });

      if (reviewOnEnd && response.ok) {
        router.push(`/sessions/${sessionId}/review`);
        return;
      }

      onEnd();
    } finally {
      setIsEnding(false);
    }
  }

  const isBudget = pipelineMode === "budget";
  const isActiveMic =
    status === "connected" &&
    (isBudget || voiceInputMode === "auto" || isPushToTalkActive);

  const isBusy = status === "processing" || status === "speaking" || status === "connecting";

  function handleStartTap() {
    const { micPromise } = prepareSessionMedia();
    startSession?.(micPromise);
  }

  function handleTalkTap() {
    if (isPushToTalkActive) {
      stopPushToTalk();
      return;
    }

    const { micPromise } = prepareSessionMedia();

    if (needsStart) {
      startSession?.(micPromise);
      return;
    }

    if (isBudget) {
      toggleTalk?.(micPromise);
      return;
    }

    if (!isBudget && voiceInputMode === "push_to_talk") {
      startPushToTalk?.();
    }
  }

  const statusLabel =
    needsStart || status === "ready"
      ? "Tap Start"
      : status === "connected"
      ? isBudget || voiceInputMode === "push_to_talk"
        ? isPushToTalkActive
          ? "Tap to stop"
          : "Tap to talk"
        : "Listening"
      : status === "connecting"
        ? "Connecting…"
      : status === "processing"
        ? "Thinking…"
      : status === "speaking"
        ? "Teenee speaking…"
      : status === "recording"
        ? "Tap to stop"
      : status === "error"
        ? "Voice error"
        : "Ready";

  return (
    <div className="flex flex-1 flex-col px-5 pb-28 pt-8">
      <p className="text-xs uppercase tracking-widest text-muted-dark">
        {phase === "explain" ? "Explain mode" : "Practice mode"} ·{" "}
        {isBudget ? "Budget voice" : "Realtime voice"}
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-tight">{lessonTitle}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-dark">
        {context?.currentItem.label ?? "French-first conversation."}
      </p>

      {isBudget ? (
        <p className="mt-2 text-xs text-muted-dark">
          Whisper + mini chat + TTS — much cheaper for daily practice.
        </p>
      ) : null}

      {lastAssistantText ? (
        <p className="mt-3 rounded-2xl bg-card-dark px-4 py-3 text-base leading-relaxed text-foreground-dark">
          <span className="text-xs uppercase tracking-widest text-muted-dark">Teenee: </span>
          {lastAssistantText}
        </p>
      ) : null}

      <div className="mt-10 flex flex-1 flex-col items-center justify-center gap-6">
        <AudioWaveform
          levels={isActiveMic || status === "recording" ? [0.3, 0.6, 0.4, 0.7, 0.5] : [0.1, 0.1, 0.1]}
          isActive={status !== "idle" && status !== "error"}
        />
        <p className="text-xs uppercase tracking-widest text-muted-dark">{statusLabel}</p>

        {(needsStart || status === "ready") ? (
          <button
            type="button"
            onClick={handleStartTap}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-accent text-sm font-semibold uppercase tracking-widest text-white"
          >
            Start
          </button>
        ) : null}

        {!needsStart &&
        status !== "ready" &&
        (status === "connected" || status === "recording") &&
        (isBudget || voiceInputMode === "push_to_talk") ? (
          <button
            type="button"
            disabled={isBusy}
            onClick={handleTalkTap}
            className={`flex h-24 w-24 items-center justify-center rounded-full text-sm font-semibold uppercase tracking-widest disabled:opacity-50 ${
              isPushToTalkActive ? "bg-accent text-white" : "border border-white/30 text-foreground-dark"
            }`}
          >
            {isPushToTalkActive ? "Stop" : "Talk"}
          </button>
        ) : null}

        {!isBudget && status === "connected" && voiceInputMode === "auto" ? (
          <button
            type="button"
            onClick={() => commitUserTurn()}
            className="rounded-full border border-white/20 px-5 py-2 text-xs font-medium uppercase tracking-widest text-foreground-dark"
          >
            Done speaking
          </button>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setPromptOpen((open) => !open)}
        className="mb-3 text-xs font-medium uppercase tracking-widest text-accent"
      >
        {promptOpen ? "Hide coach note" : "Coach note — steer the AI"}
      </button>

      {promptOpen ? (
        <div className="mb-4 space-y-2">
          <textarea
            value={promptDraft}
            onChange={(event) => setPromptDraft(event.target.value)}
            placeholder='e.g. "Stop listing vocab. Just ask one greeting and wait."'
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-card-dark p-3 text-sm text-foreground-dark placeholder:text-muted-dark"
          />
          <button
            type="button"
            disabled={isApplyingPrompt || (pipelineMode === "realtime" && status !== "connected")}
            onClick={() => void handleApplyPrompt()}
            className="h-9 rounded-full bg-accent px-4 text-xs font-semibold uppercase tracking-widest text-white disabled:opacity-50"
          >
            {isApplyingPrompt ? "Applying…" : pipelineMode === "realtime" ? "Apply now" : "Saved for next turn"}
          </button>
          <p className="text-xs text-muted-dark">
            Knowledge-base French still applies. This only changes how Teenee behaves.
          </p>
        </div>
      ) : null}

      {showTranscript ? (
        <button
          type="button"
          onClick={() => setTranscriptOpen((open) => !open)}
          className="mb-4 text-xs font-medium uppercase tracking-widest text-accent"
        >
          {transcriptOpen ? "Hide transcript" : "Show transcript"}
        </button>
      ) : null}

      {transcriptOpen ? (
        <div className="mb-4 max-h-40 overflow-y-auto rounded-2xl bg-card-dark p-4 text-left text-sm text-foreground-dark">
          {transcript.length === 0 ? (
            <p className="text-muted-dark">Transcript appears as you speak.</p>
          ) : (
            transcript.map((line, index) => (
              <p key={`${line.role}-${index}`} className="mb-2">
                <span className="text-muted-dark">{line.role === "user" ? "You" : "Teenee"}:</span>{" "}
                {line.text}
              </p>
            ))
          )}
        </div>
      ) : null}

      <div className="flex flex-col gap-3">
        {secondaryAction ? (
          <button
            type="button"
            disabled={secondaryAction.disabled}
            onClick={secondaryAction.onClick}
            className="h-11 rounded-full bg-accent text-sm font-semibold text-white disabled:opacity-50"
          >
            {secondaryAction.label}
          </button>
        ) : null}
        <button
          type="button"
          disabled={isEnding}
          onClick={() => void handleEnd()}
          className="h-11 rounded-full border border-white/20 text-sm font-medium text-foreground-dark disabled:opacity-50"
        >
          {isEnding ? "Saving session…" : "End session"}
        </button>
      </div>

      {error ? <p className="mt-4 text-center text-sm text-accent">{error}</p> : null}
    </div>
  );
}
