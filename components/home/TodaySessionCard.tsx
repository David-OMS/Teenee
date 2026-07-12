"use client";

import Link from "next/link";

import { useLessonList } from "@/hooks/use-lesson-list";
import { formatLessonDate } from "@/lib/lessons/format-lesson-date";

/** Home card — surfaces today's lesson or prompts a dump. */
export function TodaySessionCard() {
  const { lessons, isLoading } = useLessonList();
  const latest = lessons[0];

  if (isLoading) {
    return (
      <section className="mx-5 rounded-2xl bg-surface-light p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-light">
          Today&apos;s session
        </p>
        <p className="mt-2 text-sm text-muted-light">Loading…</p>
      </section>
    );
  }

  if (!latest) {
    return (
      <section className="mx-5 rounded-2xl bg-surface-light p-5">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-light">
          Today&apos;s session
        </p>
        <h2 className="mt-2 font-display text-2xl uppercase tracking-tight">No lesson yet</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-light">
          Dump what you learned in class, confirm the extraction, then practice.
        </p>
        <Link
          href="/dump"
          className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start class dump
        </Link>
      </section>
    );
  }

  const action =
    latest.status === "parsed"
      ? { href: latest.href ?? `/lessons/${latest.id}/confirm`, label: "Review & confirm" }
      : latest.status === "confirmed"
        ? { href: "/explain", label: "Explain & practice" }
        : { href: "/dump", label: "Start class dump" };

  return (
    <section className="mx-5 rounded-2xl bg-surface-light p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-muted-light">
        {latest.status === "confirmed" ? "Ready to practice" : "Latest lesson"}
      </p>
      <h2 className="mt-2 font-display text-2xl uppercase tracking-tight">{latest.title}</h2>
      <p className="mt-2 text-sm text-muted-light">{formatLessonDate(latest.classDate)}</p>
      <Link
        href={action.href}
        className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        {action.label}
      </Link>
    </section>
  );
}
