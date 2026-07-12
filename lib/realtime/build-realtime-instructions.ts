import { getConversationModeBehavior } from "@/lib/conversation/conversation-mode-behavior";
import { getCorrectionStyleBehavior } from "@/lib/conversation/correction-style-behavior";
import type { AppSettings } from "@/lib/settings/app-settings";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

function formatCorrectionBudget(context: TurnContextSlice): string {
  const { correctionBudget } = context;
  return `Correction budget this turn: max ${correctionBudget.maxGrammar} grammar, max ${correctionBudget.maxPronunciation} pronunciation. Used: ${correctionBudget.grammarUsed} grammar, ${correctionBudget.pronunciationUsed} pronunciation.`;
}

function formatActiveRecall(context: TurnContextSlice): string {
  if (!context.activeRecall) {
    return "";
  }

  return `Active recall: wait ${context.activeRecall.silenceSeconds}s silence, hint after ${context.activeRecall.hintAfterSeconds}s. Expected production: ${context.activeRecall.expectedProduction ?? "see objective"}.`;
}

/** Minimal per-turn instructions for Realtime — agenda slice + mode + policy. */
export function buildRealtimeInstructions(
  context: TurnContextSlice,
  settings: AppSettings,
  lessonTitle: string,
): string {
  const mode = getConversationModeBehavior(settings.defaultConversationMode);
  const correction = getCorrectionStyleBehavior(settings.correctionStyle);
  const node = context.currentItem.node;

  return [
    "You are Teenee — a French conversation partner for a student practicing after class.",
    `Lesson: ${lessonTitle}. Phase: ${context.phase}.`,
    `Student CEFR target: ${settings.targetCefr}. Match complexity to this level.`,
    mode.promptGuidance.trim(),
    correction.promptGuidance.trim(),
    `Current objective: ${node.objective}`,
    `Prompts: ${node.prompts.join(" ")}`,
    context.anchorPhrase ? `Anchor phrase if conversation drifts: ${context.anchorPhrase}` : "",
    context.weaknessHint ? `Known weakness to watch: ${context.weaknessHint}` : "",
    formatCorrectionBudget(context),
    formatActiveRecall(context),
    context.phaseGuidance ?? "",
    `Turn detection: also treat these as end-of-turn cues: ${settings.triggerPhrases.join(", ")}`,
    "Keep responses concise. French-first. No chat UI filler.",
  ]
    .filter(Boolean)
    .join("\n");
}
