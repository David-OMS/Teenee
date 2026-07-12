"use client";

import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { PrimaryButton } from "@/components/ui";
import { useProgressStats } from "@/hooks/use-progress-stats";

function TopicList({ title, items, emptyMessage }: { title: string; items: string[]; emptyMessage: string }) {
  return (
    <section className="rounded-2xl bg-surface-light px-5 py-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-light">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-light">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 space-y-2 text-sm">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function ProgressDashboard() {
  const { stats, isLoading, error } = useProgressStats();

  if (isLoading) {
    return <p className="px-5 text-sm text-muted-light">Loading progress…</p>;
  }

  if (error || !stats) {
    return <p className="px-5 text-sm text-accent">{error ?? "Progress unavailable."}</p>;
  }

  const metrics = [
    { label: "Speaking time", value: stats.speakingTimeLabel },
    { label: "Lessons", value: String(stats.lessonCount) },
    { label: "Streak", value: `${stats.streakDays} day${stats.streakDays === 1 ? "" : "s"}` },
  ];

  return (
    <div className="space-y-4 pb-28">
      <PageHeader title="Progress" subtitle="Activity-style metrics, not gamification." display />

      <section className="mx-5 space-y-3">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex items-center justify-between rounded-2xl bg-surface-light px-5 py-4"
          >
            <span className="text-sm text-muted-light">{metric.label}</span>
            <span className="text-lg font-semibold tabular-nums">{metric.value}</span>
          </div>
        ))}
      </section>

      {stats.nextSessionRecommendation ? (
        <section className="mx-5 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-accent">
            Tomorrow
          </h2>
          <p className="mt-2 text-sm leading-relaxed">{stats.nextSessionRecommendation}</p>
        </section>
      ) : null}

      <div className="mx-5 space-y-3">
        <TopicList
          title="Needs work"
          items={stats.weakestTopics}
          emptyMessage="No recurring weaknesses yet — keep speaking."
        />
        <TopicList
          title="Strongest"
          items={stats.strongestTopics}
          emptyMessage="Confirm a lesson and practice to build strengths."
        />
      </div>

      <div className="mx-5 pt-2">
        <Link href="/dump">
          <PrimaryButton>Dump today&apos;s class</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
