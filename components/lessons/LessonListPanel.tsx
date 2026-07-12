"use client";

import Link from "next/link";

import { LessonList } from "@/components/lessons/LessonList";
import { PageHeader } from "@/components/layout/PageHeader";
import { useLessonList } from "@/hooks/use-lesson-list";

/** Orchestrator — full lesson history. */
export function LessonListPanel() {
  const { lessons, isLoading, error } = useLessonList();

  if (isLoading) {
    return <p className="px-5 text-sm text-muted-light">Loading lessons…</p>;
  }

  if (error) {
    return <p className="px-5 text-sm text-accent">{error}</p>;
  }

  return (
    <div className="px-5 pb-24">
      <PageHeader title="Lessons" subtitle="Past class dumps and their status." />
      <LessonList lessons={lessons} emptyMessage="Dump your first class to see it here." />
      {lessons.length === 0 ? (
        <Link
          href="/dump"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start class dump
        </Link>
      ) : null}
    </div>
  );
}
