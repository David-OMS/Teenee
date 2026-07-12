import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";

export type UserStats = {
  userId: EntityId;
  speakingMinutesTotal: number;
  sessionCount: number;
  reviewStreakDays: number;
  lessonsCompleted: number;
  lastSessionAt?: IsoDateTime;
};
