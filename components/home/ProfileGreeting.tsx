"use client";

import Link from "next/link";

import type { HomeSummary } from "@/types/home/home-summary";

type ProfileGreetingProps = {
  displayName: string;
};

export function ProfileGreeting({ displayName }: ProfileGreetingProps) {
  const firstName = displayName.split(" ")[0] || displayName;

  return (
    <header className="mx-5 pt-2">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-light">Profile</p>
      <h1 className="mt-1 font-display text-4xl uppercase tracking-tight">Salut, {firstName}</h1>
      <Link href="/settings" className="mt-2 inline-block text-xs font-medium text-accent">
        Edit profile
      </Link>
    </header>
  );
}

type LevelCardProps = {
  currentLevel: HomeSummary["currentLevel"];
  targetLevel: HomeSummary["targetLevel"];
};

export function LevelCard({ currentLevel, targetLevel }: LevelCardProps) {
  return (
    <section className="mx-5 mt-5 rounded-2xl bg-surface-light px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-light">
        Current level
      </p>
      <div className="mt-2 flex items-baseline gap-3">
        <span className="font-display text-4xl tabular-nums">{currentLevel}</span>
        <span className="text-sm text-muted-light">→ target {targetLevel}</span>
      </div>
    </section>
  );
}
