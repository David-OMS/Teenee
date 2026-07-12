"use client";

import Link from "next/link";

import { LevelCard, ProfileGreeting } from "@/components/home/ProfileGreeting";
import { NameOnboardingOverlay } from "@/components/home/NameOnboardingOverlay";
import { WordOfTheDayCard } from "@/components/home/WordOfTheDayCard";
import { PastLessonsPreview } from "@/components/home/PastLessonsPreview";
import { useHomeSummary } from "@/hooks/use-home-summary";
import { useUserProfile } from "@/hooks/use-user-profile";

function SessionContinueCard({
  title,
  action,
  recommendation,
}: {
  title: string | null;
  action: { href: string; label: string } | null;
  recommendation: string | null;
}) {
  if (!action || !title) {
    return null;
  }

  return (
    <section className="mx-5 mt-4 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent">Today</p>
      <h2 className="mt-2 font-display text-xl uppercase tracking-tight">{title}</h2>
      {recommendation ? (
        <p className="mt-2 text-sm leading-relaxed text-muted-light">{recommendation}</p>
      ) : null}
      <Link
        href={action.href}
        className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white"
      >
        {action.label}
      </Link>
    </section>
  );
}

function ActivityRow({ streakDays, speakingTimeLabel }: { streakDays: number; speakingTimeLabel: string }) {
  return (
    <section className="mx-5 mt-4 flex gap-3">
      <div className="flex-1 rounded-xl bg-surface-light px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-muted-light">Streak</p>
        <p className="mt-1 text-xl font-semibold tabular-nums">
          {streakDays} day{streakDays === 1 ? "" : "s"}
        </p>
      </div>
      <div className="flex-1 rounded-xl bg-surface-light px-4 py-3">
        <p className="text-xs uppercase tracking-wide text-muted-light">Spoken</p>
        <p className="mt-1 text-xl font-semibold tabular-nums">{speakingTimeLabel}</p>
      </div>
    </section>
  );
}

/** Profile home — name, level, word of the day, session continue. */
export function ProfileHome() {
  const { summary, isLoading, error, reload } = useHomeSummary();
  const { save } = useUserProfile();

  async function completeOnboarding(name: string) {
    const result = await save({ displayName: name, profileSetupComplete: true });
    if (!result) {
      throw new Error("Could not save your name.");
    }
    await reload();
  }

  if (isLoading) {
    return <p className="px-5 pt-8 text-sm text-muted-light">Loading profile…</p>;
  }

  if (error || !summary) {
    return <p className="px-5 pt-8 text-sm text-accent">{error ?? "Profile unavailable."}</p>;
  }

  const needsOnboarding = !summary.profileSetupComplete || summary.displayName.trim().length === 0;

  return (
    <>
      {needsOnboarding ? <NameOnboardingOverlay onComplete={completeOnboarding} /> : null}

      <ProfileGreeting displayName={summary.displayName || "Learner"} />
      <LevelCard currentLevel={summary.currentLevel} targetLevel={summary.targetLevel} />
      <WordOfTheDayCard word={summary.wordOfTheDay} />
      <SessionContinueCard
        title={summary.latestLessonTitle}
        action={summary.latestLessonAction}
        recommendation={summary.nextSessionRecommendation}
      />
      <ActivityRow
        streakDays={summary.streakDays}
        speakingTimeLabel={summary.speakingTimeLabel}
      />
      <PastLessonsPreview />
    </>
  );
}
