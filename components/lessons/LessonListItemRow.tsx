import Link from "next/link";

import { LessonStatusBadge } from "@/components/lessons/LessonStatusBadge";
import { formatLessonDate } from "@/lib/lessons/format-lesson-date";
import type { LessonListItem } from "@/types/lesson/lesson-list-item";

type LessonListItemRowProps = {
  lesson: LessonListItem;
};

export function LessonListItemRow({ lesson }: LessonListItemRowProps) {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{lesson.title}</p>
        <p className="mt-0.5 text-xs text-muted-light">{formatLessonDate(lesson.classDate)}</p>
      </div>
      <LessonStatusBadge status={lesson.status} />
    </>
  );

  if (!lesson.href) {
    return <li className="flex items-center gap-3 px-5 py-4">{content}</li>;
  }

  return (
    <li>
      <Link
        href={lesson.href}
        className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-surface-light"
      >
        {content}
      </Link>
    </li>
  );
}
