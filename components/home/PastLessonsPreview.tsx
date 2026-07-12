"use client";

import Link from "next/link";

import { LessonListItemRow } from "@/components/lessons/LessonListItemRow";
import { useLessonList } from "@/hooks/use-lesson-list";

const previewLimit = 3;

/** Home preview — recent lessons with link to full list. */
export function PastLessonsPreview() {
  const { lessons, isLoading, error } = useLessonList();
  const preview = lessons.slice(0, previewLimit);

  if (isLoading || error || preview.length === 0) {
    return null;
  }

  return (
    <section className="mx-5 mt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-light">
          Past lessons
        </h2>
        {lessons.length > previewLimit ? (
          <Link href="/lessons" className="text-xs font-medium text-accent">
            View all
          </Link>
        ) : (
          <Link href="/lessons" className="text-xs font-medium text-muted-light">
            View all
          </Link>
        )}
      </div>
      <ul className="overflow-hidden rounded-2xl border border-border-light bg-canvas-light divide-y divide-border-light">
        {preview.map((lesson) => (
          <LessonListItemRow key={lesson.id} lesson={lesson} />
        ))}
      </ul>
    </section>
  );
}
