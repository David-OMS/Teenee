import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";

export type LearningWeakness = {
  id: EntityId;
  userId: EntityId;
  conceptId?: EntityId;
  category: "grammar" | "pronunciation" | "vocabulary" | "register";
  description: string;
  occurrenceCount: number;
  lastSeenAt: IsoDateTime;
};
