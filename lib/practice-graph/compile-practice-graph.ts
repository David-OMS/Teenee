import { assignEdgeIds, assignNodeIds } from "@/lib/practice-graph/assign-graph-ids";
import { buildLinearEdges } from "@/lib/practice-graph/build-linear-edges";
import { buildPronunciationFocus } from "@/lib/practice-graph/build-pronunciation-focus";
import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import { injectAnchorNodes } from "@/lib/practice-graph/inject-anchor-nodes";
import { instantiateTemplateSlots } from "@/lib/practice-graph/instantiate-template-slots";
import { getTemplateById } from "@/lib/practice-graph/templates/template-library";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { PracticeGraph } from "@/types/practice-graph/practice-graph";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { TemplateId } from "@/types/practice-template/template-id";

export function compileTemplateGraph(
  templateId: TemplateId,
  content: ConfirmedLessonContent,
  orderOffset: number,
) {
  const template = getTemplateById(templateId);
  const rawNodes = instantiateTemplateSlots(template, content, orderOffset);
  const withAnchors = injectAnchorNodes(rawNodes, content);

  return {
    templateId,
    nodes: withAnchors,
    pronunciationFocus: buildPronunciationFocus(content),
  };
}

/** Orchestrator — instantiate templates, inject recall gaps + anchors, wire edges. */
export function compilePracticeGraph(
  lessonId: string,
  userId: string,
  content: ConfirmedLessonContent,
  templateIds: TemplateId[],
): PracticeGraph {
  let orderOffset = 0;
  const compiledNodes: Omit<PracticeNode, "id">[] = [];

  for (const templateId of templateIds) {
    const compiled = compileTemplateGraph(templateId, content, orderOffset);
    compiledNodes.push(...compiled.nodes);
    orderOffset = compiledNodes.length;
  }

  const nodes = assignNodeIds(compiledNodes);
  const edges = assignEdgeIds(buildLinearEdges(nodes));

  return {
    id: createEntityId(),
    lessonId,
    userId,
    templateIds,
    nodes,
    edges,
    pronunciationFocus: buildPronunciationFocus(content),
    version: 1,
  };
}
