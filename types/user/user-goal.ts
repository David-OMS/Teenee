import type { EntityId } from "@/types/common/entity-id";

export type UserGoal = {
  id: EntityId;
  label: string;
  completed: boolean;
};
