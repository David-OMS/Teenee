import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { LessonInputType } from "@/types/lesson/lesson-input-type";

/** Raw artifact uploaded immediately after class — before AI processing. */
export type RawLessonDump = {
  inputType: LessonInputType;
  textContent?: string;
  storageKey?: string;
  audioDurationSeconds?: number;
  recordedAt: IsoDateTime;
};
