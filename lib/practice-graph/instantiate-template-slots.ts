import { fillTemplateString } from "@/lib/practice-graph/fill-template-string";
import { resolveSlotPhrases } from "@/lib/practice-graph/resolve-slot-phrases";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { PracticeTemplate } from "@/types/practice-template/practice-template";
import type { TemplateSlot } from "@/types/practice-template/template-slot";

function createNodeFromSlot(
  template: PracticeTemplate,
  slot: TemplateSlot,
  content: ConfirmedLessonContent,
  order: number,
): Omit<PracticeNode, "id"> {
  const { placeholders, conceptIds } = resolveSlotPhrases(slot.kind, content);

  return {
    kind: slot.nodeKind,
    weight: slot.weight,
    templateId: template.id,
    objective: fillTemplateString(slot.objectiveTemplate, placeholders),
    prompts: [fillTemplateString(slot.promptTemplate, placeholders)],
    targetConceptIds: conceptIds,
    order,
  };
}

function createRecallGapNode(
  template: PracticeTemplate,
  slot: TemplateSlot,
  content: ConfirmedLessonContent,
  order: number,
): Omit<PracticeNode, "id"> {
  const { placeholders, conceptIds } = resolveSlotPhrases(slot.kind, content);
  const recall = slot.recallGap!;

  return {
    kind: "recall_gap",
    weight: "revision",
    templateId: template.id,
    objective: fillTemplateString("Recall {phrase} from memory", placeholders),
    prompts: [
      fillTemplateString(
        "Active recall — wait for the student to produce {phrase} without help.",
        placeholders,
      ),
    ],
    targetConceptIds: conceptIds,
    expectedProduction: placeholders.phrase,
    silenceSeconds: recall.silenceSeconds,
    hintAfterSeconds: recall.hintAfterSeconds,
    order,
  };
}

export function instantiateTemplateSlots(
  template: PracticeTemplate,
  content: ConfirmedLessonContent,
  orderOffset: number,
): Omit<PracticeNode, "id">[] {
  const nodes: Omit<PracticeNode, "id">[] = [];
  let order = orderOffset;

  for (const slot of template.slots) {
    nodes.push(createNodeFromSlot(template, slot, content, order));
    order += 1;

    if (slot.recallGap) {
      nodes.push(createRecallGapNode(template, slot, content, order));
      order += 1;
    }
  }

  return nodes;
}
