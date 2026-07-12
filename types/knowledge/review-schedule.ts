import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";

export type ReviewSchedule = {
  id: EntityId;
  conceptId: EntityId;
  dueAt: IsoDateTime;
  intervalDays: number;
  successCount: number;
  failureCount: number;
  lastReviewedAt?: IsoDateTime;
};
