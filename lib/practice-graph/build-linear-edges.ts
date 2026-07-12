import type { PracticeEdge } from "@/types/practice-graph/practice-edge";
import type { PracticeNode } from "@/types/practice-graph/practice-node";

/** Chain nodes in order with default edges. */
export function buildLinearEdges(nodes: PracticeNode[]): Omit<PracticeEdge, "id">[] {
  const edges: Omit<PracticeEdge, "id">[] = [];

  for (let index = 0; index < nodes.length - 1; index += 1) {
    edges.push({
      fromNodeId: nodes[index].id,
      toNodeId: nodes[index + 1].id,
      condition: "default",
    });
  }

  return edges;
}
