import { LessonListItemRow } from "@/components/lessons/LessonListItemRow";
import type { LessonListItem } from "@/types/lesson/lesson-list-item";

type LessonListProps = {
  lessons: LessonListItem[];
  emptyMessage?: string;
};

export function LessonList({ lessons, emptyMessage = "No lessons yet." }: LessonListProps) {
  if (lessons.length === 0) {
    return <p className="px-5 text-sm text-muted-light">{emptyMessage}</p>;
  }

  return (
    <ul className="divide-y divide-border-light rounded-2xl border border-border-light bg-canvas-light">
      {lessons.map((lesson) => (
        <LessonListItemRow key={lesson.id} lesson={lesson} />
      ))}
    </ul>
  );
}
