import type { KnowledgeBaseScope } from "@/lib/realtime/build-knowledge-base-scope";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

function formatRecallCue(context: TurnContextSlice, scope: KnowledgeBaseScope): string {
  const target = context.activeRecall?.expectedProduction ?? "the target phrase";

  return [
    "Active recall: stay silent and wait for the student.",
    `They should produce: ${target}`,
    scope.complexity === "minimal"
      ? "If stuck, give ONE word hint from the knowledge base only. No extra teaching."
      : "If stuck, give a small hint using knowledge-base phrases only.",
  ].join(" ");
}

function formatMinimalBeat(context: TurnContextSlice, scope: KnowledgeBaseScope): string {
  if (context.activeRecall) {
    return formatRecallCue(context, scope);
  }

  return "ONE phrase or question from the knowledge base. Then stop and listen.";
}

function formatBuildingBeat(context: TurnContextSlice, scope: KnowledgeBaseScope): string {
  if (context.activeRecall) {
    return formatRecallCue(context, scope);
  }

  return "One short sentence from the knowledge base (max 2 phrases combined). Then listen.";
}

function formatConversationalBeat(context: TurnContextSlice, scope: KnowledgeBaseScope): string {
  if (context.activeRecall) {
    return formatRecallCue(context, scope);
  }

  const node = context.currentItem.node;
  return `Natural turn for: ${node.objective}. Knowledge-base French only. One turn, then listen.`;
}

/** Beat-level cue scaled to knowledge-base size. */
export function formatPracticeBeatCue(
  context: TurnContextSlice,
  scope: KnowledgeBaseScope,
): string {
  if (context.phase !== "practice") {
    const node = context.currentItem.node;
    return node.prompts[0] ?? node.objective;
  }

  switch (scope.complexity) {
    case "minimal":
      return formatMinimalBeat(context, scope);
    case "building":
      return formatBuildingBeat(context, scope);
    case "conversational":
      return formatConversationalBeat(context, scope);
  }
}

export function formatActiveRecallForScope(
  context: TurnContextSlice,
  scope: KnowledgeBaseScope,
): string {
  if (!context.activeRecall || context.phase !== "practice") {
    if (!context.activeRecall) {
      return "";
    }

    return `Active recall: wait ${context.activeRecall.silenceSeconds}s silence, hint after ${context.activeRecall.hintAfterSeconds}s. Expected production: ${context.activeRecall.expectedProduction ?? "see objective"}.`;
  }

  return formatRecallCue(context, scope);
}
