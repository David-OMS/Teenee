import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";
import type { AgendaItem } from "@/types/session/agenda-item";
import type { PracticeNode } from "@/types/practice-graph/practice-node";

function conceptLabel(item: KnowledgeItem): string {
  if (item.kind === "grammar") {
    return item.topic;
  }

  return item.french;
}

function buildReviewNode(item: KnowledgeItem, order: number): PracticeNode {
  const label = conceptLabel(item);

  return {
    id: createEntityId(),
    kind: "exchange",
    weight: "revision",
    templateId: "review",
    objective: `Review ${label}`,
    prompts: [`Quick review — recall and use "${label}" naturally in conversation.`],
    targetConceptIds: [item.id],
    order,
  };
}

export function buildReviewAgendaItem(item: KnowledgeItem, order: number): AgendaItem {
  const node = buildReviewNode(item, order);

  return {
    id: createEntityId(),
    priority: "review",
    label: `Review: ${conceptLabel(item)}`,
    node,
    conceptIds: [item.id],
  };
}
