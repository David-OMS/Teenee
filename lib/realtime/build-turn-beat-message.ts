import {
  formatActiveRecallForScope,
  formatPracticeBeatCue,
} from "@/lib/realtime/format-practice-beat-cue";
import type { KnowledgeBaseScope } from "@/lib/realtime/build-knowledge-base-scope";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

function formatCorrectionBudget(context: TurnContextSlice): string {
  const { correctionBudget } = context;
  return `Correction budget this turn: max ${correctionBudget.maxGrammar} grammar, max ${correctionBudget.maxPronunciation} pronunciation. Used: ${correctionBudget.grammarUsed} grammar, ${correctionBudget.pronunciationUsed} pronunciation.`;
}

/** Per-turn beat cue — sent as a small [BEAT] message instead of rewriting full instructions. */
export function buildTurnBeatMessage(
  context: TurnContextSlice,
  knowledgeScope: KnowledgeBaseScope,
): string {
  const node = context.currentItem.node;
  const beatCue = formatPracticeBeatCue(context, knowledgeScope);

  return [
    "[BEAT]",
    `Objective: ${node.objective}`,
    `Cue: ${beatCue}`,
    context.anchorPhrase ? `Anchor if drifting: ${context.anchorPhrase}` : "",
    context.weaknessHint ? `Watch weakness: ${context.weaknessHint}` : "",
    formatCorrectionBudget(context),
    formatActiveRecallForScope(context, knowledgeScope),
  ]
    .filter(Boolean)
    .join("\n");
}
