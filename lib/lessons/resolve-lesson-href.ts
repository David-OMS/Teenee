import type { LessonStatus } from "@/types/lesson/lesson-status";

export function resolveLessonHref(lessonId: string, status: LessonStatus): string | null {
  if (status === "parsed") {
    return `/lessons/${lessonId}/confirm`;
  }

  if (status === "confirmed") {
    return "/practice";
  }

  return null;
}
