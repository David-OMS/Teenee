import type { EntityId } from "@/types/common/entity-id";
import type { PracticeEdge } from "@/types/practice-graph/practice-edge";
import type { PracticeNode } from "@/types/practice-graph/practice-node";

/** Lesson-scoped graph — determines how knowledge is exercised in conversation. */
export type PracticeGraph = {
  id: EntityId;
  lessonId: EntityId;
  userId: EntityId;
  templateIds: string[];
  nodes: PracticeNode[];
  edges: PracticeEdge[];
  pronunciationFocus: string;
  version: number;
};
