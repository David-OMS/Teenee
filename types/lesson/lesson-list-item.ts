import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { LessonStatus } from "@/types/lesson/lesson-status";

/** Row shape for lesson list views. */
export type LessonListItem = {
  id: string;
  title: string;
  status: LessonStatus;
  classDate: IsoDateTime;
  href: string | null;
};
