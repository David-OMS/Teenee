import { buildAgendaItemFromNode } from "@/lib/orchestrator/build-agenda-item-from-node";
import { buildSessionPronunciationFocus } from "@/lib/orchestrator/build-session-pronunciation-focus";
import { assignNodeIds } from "@/lib/practice-graph/assign-graph-ids";
import { instantiateTemplateSlots } from "@/lib/practice-graph/instantiate-template-slots";
import { explainLessonFlowTemplate } from "@/lib/practice-graph/templates/explain-lesson-flow-template";
import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { KnowledgeSnapshot } from "@/types/knowledge/knowledge-snapshot";
import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { SessionAgenda } from "@/types/session/session-agenda";

type BuildExplainSessionAgendaInput = {
  sessionId: string;
  lessonId: string;
  content: ConfirmedLessonContent;
  practiceGraph: PracticeGraph;
  knowledge: KnowledgeSnapshot;
};

/** Build Explain Mode agenda from ExplainLessonFlow template only. */
export function buildExplainSessionAgenda(input: BuildExplainSessionAgendaInput): SessionAgenda {
  const nodes = assignNodeIds(
    instantiateTemplateSlots(explainLessonFlowTemplate, input.content, 0),
  );
  const items = nodes.map((node) => buildAgendaItemFromNode(node));

  return {
    id: createEntityId(),
    sessionId: input.sessionId,
    lessonId: input.lessonId,
    items,
    beats: [],
    pronunciationFocus: buildSessionPronunciationFocus(input.practiceGraph, input.knowledge.items),
    distribution: { revision: items.length, stretch: 0, discovery: 0 },
    createdAt: new Date().toISOString(),
  };
}
