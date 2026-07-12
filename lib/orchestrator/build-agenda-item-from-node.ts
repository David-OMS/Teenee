import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { AgendaItem } from "@/types/session/agenda-item";
import type { AgendaPriority } from "@/types/session/session-phase";

function assignPriority(node: PracticeNode): AgendaPriority {
  if (node.weight === "discovery") {
    return "challenge";
  }

  if (node.weight === "stretch") {
    return "secondary";
  }

  return "primary";
}

export function buildAgendaItemFromNode(node: PracticeNode): AgendaItem {
  return {
    id: createEntityId(),
    priority: assignPriority(node),
    label: node.objective,
    node,
    conceptIds: node.targetConceptIds,
  };
}
