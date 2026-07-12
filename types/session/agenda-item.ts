import type { EntityId } from "@/types/common/entity-id";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { AgendaPriority } from "@/types/session/session-phase";

export type AgendaItem = {
  id: EntityId;
  priority: AgendaPriority;
  label: string;
  node: PracticeNode;
  conceptIds: EntityId[];
};
