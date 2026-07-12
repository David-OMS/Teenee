"use client";

import { useProgressStats } from "@/hooks/use-progress-stats";

type StatItemProps = {
  label: string;
  value: string;
};

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex-1 rounded-xl bg-surface-light px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-light">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

export function SpeakingStreak() {
  const { stats, isLoading } = useProgressStats();

  const streak = isLoading ? "…" : String(stats?.streakDays ?? 0);
  const spoken = isLoading ? "…" : (stats?.speakingTimeLabel ?? "0m");

  return (
    <section className="mx-5 mt-4">
      <div className="flex gap-3">
        <StatItem label="Streak" value={streak} />
        <StatItem label="Spoken" value={spoken} />
      </div>
    </section>
  );
}
