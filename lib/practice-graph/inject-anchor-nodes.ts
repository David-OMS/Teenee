import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { TemplateId } from "@/types/practice-template/template-id";

const anchorPhrases: Partial<Record<TemplateId, string>> = {
  greeting_flow: "Revenons aux salutations — {phrase}.",
  classroom_objects_flow: "Restons sur les objets de la classe — {object}.",
};

/** Inject anchor nodes mid-flow to pull conversation back on topic. */
export function injectAnchorNodes(
  nodes: Omit<PracticeNode, "id">[],
  content: ConfirmedLessonContent,
): Omit<PracticeNode, "id">[] {
  if (nodes.length < 4) {
    return nodes;
  }

  const templateId = nodes[0]?.templateId as TemplateId | undefined;
  const anchorPhrase = templateId ? anchorPhrases[templateId] : undefined;

  if (!anchorPhrase || templateId === "explain_lesson_flow") {
    return nodes;
  }

  const insertAt = Math.floor(nodes.length / 2);
  const primary = content.expressions[0] ?? content.vocabulary[0];
  const anchorNode: Omit<PracticeNode, "id"> = {
    kind: "anchor",
    weight: "revision",
    templateId: templateId!,
    objective: "Pull conversation back to today's lesson",
    prompts: [
      anchorPhrase
        .replace("{phrase}", primary?.french ?? content.title)
        .replace("{object}", content.vocabulary[0]?.french ?? content.title),
    ],
    targetConceptIds: primary ? [primary.id] : [],
    anchorPhrase: anchorPhrase
      .replace("{phrase}", primary?.french ?? content.title)
      .replace("{object}", content.vocabulary[0]?.french ?? content.title),
    order: insertAt,
  };

  const withAnchor = [...nodes.slice(0, insertAt), anchorNode, ...nodes.slice(insertAt)];

  return withAnchor.map((node, index) => ({
    ...node,
    order: index,
  }));
}
