import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { Beat } from "@/types/session/beat";

export function buildSessionBeats(nodes: PracticeNode[]): Beat[] {
  return nodes
    .filter((node) => node.kind === "anchor")
    .map((node) => ({
      id: createEntityId(),
      label: node.objective,
      nodeId: node.id,
      completed: false,
    }));
}

export function findNearestAnchorPhrase(
  nodes: PracticeNode[],
  currentNodeId: string,
): string | undefined {
  const currentIndex = nodes.findIndex((node) => node.id === currentNodeId);
  if (currentIndex === -1) {
    return undefined;
  }

  for (let index = currentIndex; index >= 0; index -= 1) {
    const node = nodes[index];
    if (node.kind === "anchor" && node.anchorPhrase) {
      return node.anchorPhrase;
    }
  }

  return undefined;
}
