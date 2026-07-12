import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

type TitleSource = {
  confirmed: ConfirmedLessonContent | null;
  parsed: ParsedLessonSummary | null;
};

export function resolveLessonTitle(source: TitleSource): string {
  if (source.confirmed?.title) {
    return source.confirmed.title;
  }

  if (source.parsed?.title) {
    return source.parsed.title;
  }

  return "Untitled lesson";
}
