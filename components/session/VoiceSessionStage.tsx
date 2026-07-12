"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { AudioWaveform } from "@/components/dump/AudioWaveform";
import { useRealtimeVoice } from "@/hooks/use-realtime-voice";
import type { TranscriptLine } from "@/lib/realtime/parse-realtime-event";
import type { SessionPhase } from "@/types/session/session-phase";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

type VoiceSessionStageProps = {
  sessionId: string;
  lessonTitle: string;
  phase: SessionPhase;
  context: TurnContextSlice | null;
  showTranscript: boolean;
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
  onEnd,
  reviewOnEnd = false,
  onTurnComplete,
  secondaryAction,
}: VoiceSessionStageProps) {
  const router = useRouter();
  const startedAtRef = useRef<number>(Date.now());
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const { status, transcript, error, connect, disconnect } = useRealtimeVoice(
    sessionId,
    onTurnComplete,
  );

  useEffect(() => {
    void connect();
    return () => disconnect();
  }, [connect, disconnect]);

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

  const statusLabel =
    status === "connected"
      ? "Listening"
      : status === "connecting"
        ? "Connecting…"
        : status === "error"
          ? "Voice error"
          : "Ready";

  return (
    <div className="flex flex-1 flex-col px-5 pb-28 pt-8">
      <p className="text-xs uppercase tracking-widest text-muted-dark">
        {phase === "explain" ? "Explain mode" : "Practice mode"}
      </p>
      <h1 className="mt-2 font-display text-3xl uppercase tracking-tight">{lessonTitle}</h1>
      <p className="mt-4 text-sm leading-relaxed text-muted-dark">
        {context?.currentItem.label ?? "French-first conversation."}
      </p>

      <div className="mt-10 flex flex-1 flex-col items-center justify-center gap-6">
        <AudioWaveform
          levels={status === "connected" ? [0.3, 0.6, 0.4, 0.7, 0.5] : [0.1, 0.1, 0.1]}
          isActive={status === "connected"}
        />
        <p className="text-xs uppercase tracking-widest text-muted-dark">{statusLabel}</p>
      </div>

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
