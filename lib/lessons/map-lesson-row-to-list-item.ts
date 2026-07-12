import { resolveLessonHref } from "@/lib/lessons/resolve-lesson-href";
import { resolveLessonTitle } from "@/lib/lessons/resolve-lesson-title";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { LessonListItem } from "@/types/lesson/lesson-list-item";
import type { LessonStatus } from "@/types/lesson/lesson-status";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

type LessonListRow = {
  id: string;
  status: string;
  class_date: string;
  parsed: ParsedLessonSummary | null;
  confirmed: ConfirmedLessonContent | null;
};

export function mapLessonRowToListItem(row: LessonListRow): LessonListItem {
  const status = row.status as LessonStatus;

  return {
    id: row.id,
    title: resolveLessonTitle({ confirmed: row.confirmed, parsed: row.parsed }),
    status,
    classDate: row.class_date,
    href: resolveLessonHref(row.id, status),
  };
}
