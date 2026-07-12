import type { EntityId } from "@/types/common/entity-id";

export type PracticeEdge = {
  id: EntityId;
  fromNodeId: EntityId;
  toNodeId: EntityId;
  condition?: "default" | "success" | "failure" | "skipped";
};
