import type { EntityId } from "@/types/common/entity-id";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";

export type LessonConfirmPayload = {
  lessonId: EntityId;
  content: ConfirmedLessonContent;
};
