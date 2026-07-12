"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { PrimaryButton } from "@/components/ui";
import { formatSpeakingDuration } from "@/lib/progress/format-speaking-duration";
import type { SessionReviewPayload } from "@/lib/session/fetch-session-review";

type SessionReviewPanelProps = {
  sessionId: string;
};

function ReviewSection({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl bg-surface-light px-5 py-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-light">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {items.map((item) => (
          <li key={item} className="list-inside list-disc">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SessionReviewPanel({ sessionId }: SessionReviewPanelProps) {
  const [payload, setPayload] = useState<SessionReviewPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/sessions/${sessionId}/review`);
        const data = (await response.json()) as SessionReviewPayload & { error?: string };

        if (!response.ok) {
          throw new Error(data.error ?? "Could not load review.");
        }

        if (!cancelled) {
          setPayload(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load review.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (isLoading) {
    return <p className="px-5 text-sm text-muted-light">Summarizing your session…</p>;
  }

  if (error || !payload) {
    return <p className="px-5 text-sm text-accent">{error ?? "Review unavailable."}</p>;
  }

  const { review } = payload;

  return (
    <div className="space-y-4 pb-28">
      <PageHeader
        title="Session review"
        subtitle={`${payload.lessonTitle} · ${formatSpeakingDuration(payload.durationSeconds)}`}
        display
      />

      <section className="mx-5 rounded-2xl bg-surface-light px-5 py-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-light">Speaking score</p>
        <p className="mt-2 font-display text-5xl tabular-nums">{review.speakingScore}</p>
        <p className="mt-1 text-xs text-muted-light">out of 100</p>
      </section>

      <div className="mx-5 space-y-3">
        <ReviewSection title="Grammar to fix" items={review.grammarMistakes} />
        <ReviewSection title="Pronunciation tips" items={review.pronunciationImprovements} />
        <ReviewSection title="Vocabulary used" items={review.vocabularyUsed} />
        <ReviewSection title="New expressions" items={review.expressionsIntroduced} />
        <ReviewSection title="Revise tomorrow" items={review.suggestedRevision} />
        <ReviewSection title="Next session" items={review.nextSessionRecommendations} />
      </div>

      <div className="mx-5 flex flex-col gap-3 pt-2">
        <Link href="/progress">
          <PrimaryButton>View progress</PrimaryButton>
        </Link>
        <Link
          href="/"
          className="flex h-11 items-center justify-center rounded-full border border-border-light text-sm font-medium"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
