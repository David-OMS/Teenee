import { buildAgendaItemFromNode } from "@/lib/orchestrator/build-agenda-item-from-node";
import { buildReviewAgendaItem } from "@/lib/orchestrator/build-review-agenda-item";
import { buildSessionBeats } from "@/lib/orchestrator/build-session-beats";
import { buildSessionPronunciationFocus } from "@/lib/orchestrator/build-session-pronunciation-focus";
import { mergeReviewItemsIntoQueue } from "@/lib/orchestrator/merge-review-items-into-queue";
import {
  countDistribution,
  orderNodesByDistribution,
} from "@/lib/orchestrator/order-nodes-by-distribution";
import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import type { KnowledgeItem } from "@/types/knowledge/knowledge-item";
import type { KnowledgeSnapshot } from "@/types/knowledge/knowledge-snapshot";
import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { SessionAgenda } from "@/types/session/session-agenda";

type BuildSessionAgendaInput = {
  sessionId: string;
  lessonId: string;
  practiceGraph: PracticeGraph;
  knowledge: KnowledgeSnapshot;
  allKnowledgeItems: KnowledgeItem[];
};

/** Pre-session agenda builder — Practice Graph + Knowledge Graph → Session Agenda. */
export function buildSessionAgenda(input: BuildSessionAgendaInput): SessionAgenda {
  const orderedNodes = orderNodesByDistribution(input.practiceGraph.nodes);
  const lessonItems = orderedNodes.map((node) => buildAgendaItemFromNode(node));

  const itemsById = new Map(input.allKnowledgeItems.map((item) => [item.id, item]));
  const crossLessonReviews = input.knowledge.dueReviews
    .map((review) => itemsById.get(review.conceptId))
    .filter((item): item is KnowledgeItem => Boolean(item))
    .filter((item) => item.lessonId !== input.lessonId);

  const reviewItems = crossLessonReviews.map((item, index) =>
    buildReviewAgendaItem(item, lessonItems.length + index),
  );

  const items = mergeReviewItemsIntoQueue(lessonItems, reviewItems);
  const distribution = countDistribution(orderedNodes);

  return {
    id: createEntityId(),
    sessionId: input.sessionId,
    lessonId: input.lessonId,
    items,
    beats: buildSessionBeats(orderedNodes),
    pronunciationFocus: buildSessionPronunciationFocus(
      input.practiceGraph,
      input.knowledge.items,
    ),
    distribution,
    createdAt: new Date().toISOString(),
  };
}
