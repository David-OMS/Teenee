"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { VoiceSessionStage } from "@/components/session/VoiceSessionStage";
import { SessionRecordButton } from "@/components/session/SessionRecordButton";
import { useLatestConfirmedLesson } from "@/hooks/use-latest-confirmed-lesson";
import { useSessionFlow } from "@/hooks/use-session-flow";
import { useUserSettings } from "@/hooks/use-user-settings";
import { getConversationModeBehavior } from "@/lib/conversation/conversation-mode-behavior";

/** Practice Mode — full conversation on today's Practice Graph. */
export function PracticeSessionPanel() {
  const searchParams = useSearchParams();
  const paramSessionId = searchParams.get("sessionId");
  const paramLessonId = searchParams.get("lessonId");
  const { lesson, isLoading: lessonLoading, error: lessonError } = useLatestConfirmedLesson();
  const { settings } = useUserSettings();
  const { sessionId, lessonTitle, context, isLoading, error, start, hydrate, advance } =
    useSessionFlow();

  useEffect(() => {
    if (paramSessionId && !sessionId) {
      void hydrate(paramSessionId);
    }
  }, [hydrate, paramSessionId, sessionId]);

  async function handleStart() {
    const targetLessonId = paramLessonId ?? lesson?.id;
    if (!targetLessonId) {
      return;
    }

    await start(targetLessonId, "practice");
  }

  if (lessonLoading) {
    return <p className="px-8 text-sm text-muted-dark">Loading lesson…</p>;
  }

  if (!lesson && !paramLessonId) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-3xl uppercase tracking-tight">Practice</p>
        <p className="mt-4 max-w-xs text-sm text-muted-dark">
          Confirm a lesson, explain it, then practice speaking.
        </p>
        <Link href="/explain" className="mt-8 text-sm font-medium text-accent">
          Start with Explain
        </Link>
      </div>
    );
  }

  const title = lessonTitle ?? lesson?.title ?? "Practice";
  const activeSessionId = paramSessionId ?? sessionId;
  const modeLabel = settings
    ? getConversationModeBehavior(settings.defaultConversationMode).shortLabel
    : "Hybrid";

  if (activeSessionId) {
    return (
      <>
        <p className="px-5 pt-6 text-center text-xs uppercase tracking-widest text-muted-dark">
          Mode: {modeLabel}
        </p>
        <VoiceSessionStage
          sessionId={activeSessionId}
          lessonTitle={title}
          phase="practice"
          context={context}
          showTranscript={settings?.transcriptVisible ?? false}
          silenceTimeoutSeconds={settings?.silenceTimeoutSeconds ?? 2}
          reviewOnEnd
          onTurnComplete={async () => {
            await advance("success");
          }}
          onEnd={() => window.location.assign("/progress")}
        />
      </>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
      <p className="text-xs uppercase tracking-widest text-muted-dark">Practice mode</p>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-tight">{title}</h1>
      <p className="mt-2 text-xs uppercase tracking-widest text-muted-dark">Mode: {modeLabel}</p>
      <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-dark">
        Explain your lesson first, then practice here. French-first — English only when you need it.
      </p>
      <div className="mt-12 flex flex-col items-center gap-6">
        <SessionRecordButton
          label={isLoading ? "Starting…" : "Start practice"}
          onClick={() => void handleStart()}
          disabled={isLoading}
        />
        <Link href="/explain" className="text-xs font-medium uppercase tracking-widest text-accent">
          Explain lesson first
        </Link>
      </div>
      {error || lessonError ? (
        <p className="mt-6 text-sm text-accent">{error ?? lessonError}</p>
      ) : null}
    </div>
  );
}
