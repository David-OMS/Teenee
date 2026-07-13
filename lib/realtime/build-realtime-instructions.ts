import { getConversationModeBehavior } from "@/lib/conversation/conversation-mode-behavior";
import { getCorrectionStyleBehavior } from "@/lib/conversation/correction-style-behavior";
import {
  formatKnowledgeScopeInstructions,
  type KnowledgeBaseScope,
} from "@/lib/realtime/build-knowledge-base-scope";
import {
  formatActiveRecallForScope,
  formatPracticeBeatCue,
} from "@/lib/realtime/format-practice-beat-cue";
import type { AppSettings } from "@/lib/settings/app-settings";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

function formatCorrectionBudget(context: TurnContextSlice): string {
  const { correctionBudget } = context;
  return `Correction budget this turn: max ${correctionBudget.maxGrammar} grammar, max ${correctionBudget.maxPronunciation} pronunciation. Used: ${correctionBudget.grammarUsed} grammar, ${correctionBudget.pronunciationUsed} pronunciation.`;
}

/** Minimal per-turn instructions for Realtime — agenda slice + knowledge base + mode. */
export function buildRealtimeInstructions(
  context: TurnContextSlice,
  settings: AppSettings,
  lessonTitle: string,
  knowledgeScope: KnowledgeBaseScope,
  promptOverride?: string,
): string {
  const mode = getConversationModeBehavior(settings.defaultConversationMode);
  const correction = getCorrectionStyleBehavior(settings.correctionStyle);
  const node = context.currentItem.node;
  const beatCue = formatPracticeBeatCue(context, knowledgeScope);

  return [
    "You are Teenee — a French conversation partner for a student practicing after class.",
    `Lesson: ${lessonTitle}. Phase: ${context.phase}.`,
    `Student level: ${knowledgeScope.estimatedCefr} (target ${knowledgeScope.targetCefr}).`,
    mode.promptGuidance.trim(),
    correction.promptGuidance.trim(),
    "",
    formatKnowledgeScopeInstructions(knowledgeScope),
    "",
    "CONVERSATION RULES:",
    "- ONE turn at a time — then stop and listen. No monologues.",
    "- Never list vocabulary. Never teach unprompted.",
    "- Never announce the session is finished, say goodbye, or wrap up unless the student ends it.",
    "- Do not say « we're done » or combine two beats in one turn.",
    "",
    `Current beat: ${node.objective}`,
    `Your cue for this beat: ${beatCue}`,
    context.anchorPhrase ? `Anchor phrase if conversation drifts: ${context.anchorPhrase}` : "",
    context.weaknessHint ? `Known weakness to watch: ${context.weaknessHint}` : "",
    formatCorrectionBudget(context),
    formatActiveRecallForScope(context, knowledgeScope),
    context.phaseGuidance ?? "",
    `Turn detection: also treat these as end-of-turn cues: ${settings.triggerPhrases.join(", ")}`,
    promptOverride?.trim()
      ? [
          "",
          "USER DIRECTIVES (follow these for tone and behavior — knowledge-base allow-list still applies):",
          promptOverride.trim(),
        ].join("\n")
      : "",
    "French-first. No chat UI filler.",
  ]
    .filter(Boolean)
    .join("\n");
}
