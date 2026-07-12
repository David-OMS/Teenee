import type { PracticeNode } from "@/types/practice-graph/practice-node";

export type TurnOutcome = "success" | "partial" | "failure";

/** Decide whether to advance to the next graph node or stay on the current one. */
export function shouldAdvanceNode(
  node: PracticeNode,
  outcome: TurnOutcome,
  turnsOnNode: number,
): boolean {
  if (node.kind === "recall_gap") {
    return outcome === "success";
  }

  if (node.kind === "anchor") {
    return turnsOnNode >= 1;
  }

  if (node.kind === "switch") {
    return outcome !== "failure" && turnsOnNode >= 2;
  }

  if (node.kind === "stretch") {
    return outcome === "success" || turnsOnNode >= 2;
  }

  return outcome !== "failure" || turnsOnNode >= 2;
}
