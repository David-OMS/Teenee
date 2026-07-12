"use client";

import { useLessonList } from "@/hooks/use-lesson-list";
import type { LessonListItem } from "@/types/lesson/lesson-list-item";

export function useLatestConfirmedLesson(): {
  lesson: LessonListItem | null;
  isLoading: boolean;
  error: string | null;
} {
  const { lessons, isLoading, error } = useLessonList();
  const lesson = lessons.find((item) => item.status === "confirmed") ?? null;

  return { lesson, isLoading, error };
}
