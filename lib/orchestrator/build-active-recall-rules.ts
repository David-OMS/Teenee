import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { ActiveRecallRules } from "@/types/session/active-recall-rules";

/** Active Recall executor rules for recall_gap nodes. */
export function buildActiveRecallRules(node: PracticeNode): ActiveRecallRules | undefined {
  if (node.kind !== "recall_gap") {
    return undefined;
  }

  return {
    silenceSeconds: node.silenceSeconds ?? 5,
    hintAfterSeconds: node.hintAfterSeconds ?? 8,
    expectedProduction: node.expectedProduction,
  };
}
