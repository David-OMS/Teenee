import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import type { PracticeEdge } from "@/types/practice-graph/practice-edge";
import type { PracticeNode } from "@/types/practice-graph/practice-node";

export function assignNodeIds(nodes: Omit<PracticeNode, "id">[]): PracticeNode[] {
  return nodes.map((node) => ({
    ...node,
    id: createEntityId(),
  }));
}

export function assignEdgeIds(edges: Omit<PracticeEdge, "id">[]): PracticeEdge[] {
  return edges.map((edge) => ({
    ...edge,
    id: createEntityId(),
  }));
}
