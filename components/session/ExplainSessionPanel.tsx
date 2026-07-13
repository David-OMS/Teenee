"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { VoiceSessionStage } from "@/components/session/VoiceSessionStage";
import { SessionRecordButton } from "@/components/session/SessionRecordButton";
import { useLatestConfirmedLesson } from "@/hooks/use-latest-confirmed-lesson";
import { useSessionFlow } from "@/hooks/use-session-flow";
import { useUserSettings } from "@/hooks/use-user-settings";

/** Explain Mode — rubber-duck today's lesson before practice. */
export function ExplainSessionPanel() {
  const router = useRouter();
  const { lesson, isLoading: lessonLoading, error: lessonError } = useLatestConfirmedLesson();
  const { settings } = useUserSettings();
  const { sessionId, lessonTitle, context, isLoading, error, start, transitionToPractice, advance } =
    useSessionFlow();

  async function handleStart() {
    if (!lesson) {
      return;
    }

    await start(lesson.id, "explain");
  }

  async function handleFinish() {
    if (!sessionId) {
      return;
    }

    const result = await transitionToPractice(sessionId);
    if (result) {
      router.push(`/practice?sessionId=${result.sessionId}&lessonId=${result.lessonId}`);
    }
  }

  if (lessonLoading) {
    return <p className="px-8 text-sm text-muted-dark">Loading lesson…</p>;
  }

  if (!lesson) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-3xl uppercase tracking-tight">Explain</p>
        <p className="mt-4 max-w-xs text-sm text-muted-dark">
          Confirm a lesson first — then explain it in your own words before practice.
        </p>
        <Link href="/lessons" className="mt-8 text-sm font-medium text-accent">
          View lessons
        </Link>
      </div>
    );
  }

  const title = lessonTitle ?? lesson.title;

  if (sessionId) {
    return (
      <VoiceSessionStage
        sessionId={sessionId}
        lessonTitle={title}
        phase="explain"
        context={context}
        showTranscript={settings?.transcriptVisible ?? false}
        silenceTimeoutSeconds={settings?.silenceTimeoutSeconds ?? 2}
        onTurnComplete={async () => {
          await advance("success");
        }}
        onEnd={() => router.push("/")}
        secondaryAction={{
          label: isLoading ? "Starting practice…" : "Done — start practice",
          onClick: () => void handleFinish(),
          disabled: isLoading,
        }}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
      <p className="text-xs uppercase tracking-widest text-muted-dark">Explain mode</p>
      <h1 className="mt-3 font-display text-4xl uppercase tracking-tight">{title}</h1>
      <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-dark">
        Explain what you learned today — in your own words. AI listens, corrects only real
        misunderstandings.
      </p>
      <div className="mt-12">
        <SessionRecordButton
          label={isLoading ? "Starting…" : "Start explaining"}
          onClick={() => void handleStart()}
          disabled={isLoading}
        />
      </div>
      {error || lessonError ? (
        <p className="mt-6 text-sm text-accent">{error ?? lessonError}</p>
      ) : null}
    </div>
  );
}
