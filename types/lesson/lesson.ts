import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { LessonStatus } from "@/types/lesson/lesson-status";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";
import type { RawLessonDump } from "@/types/lesson/raw-lesson-dump";

/** Full lesson record: ingest → parse → confirm → compile graphs. */
export type Lesson = {
  id: EntityId;
  userId: EntityId;
  status: LessonStatus;
  raw: RawLessonDump;
  parsed?: ParsedLessonSummary;
  confirmed?: ConfirmedLessonContent;
  classDate: IsoDateTime;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};
