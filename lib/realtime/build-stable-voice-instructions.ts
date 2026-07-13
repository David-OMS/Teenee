import { getConversationModeBehavior } from "@/lib/conversation/conversation-mode-behavior";
import { getCorrectionStyleBehavior } from "@/lib/conversation/correction-style-behavior";
import {
  formatKnowledgeScopeInstructions,
  type KnowledgeBaseScope,
} from "@/lib/realtime/build-knowledge-base-scope";
import type { AppSettings } from "@/lib/settings/app-settings";
import type { SessionPhase } from "@/types/session/session-phase";

/** Stable session instructions — sent once at connect to maximize prompt caching. */
export function buildStableVoiceInstructions(input: {
  settings: AppSettings;
  lessonTitle: string;
  knowledgeScope: KnowledgeBaseScope;
  phase: SessionPhase;
  phaseGuidance?: string;
  promptOverride?: string;
}): string {
  const mode = getConversationModeBehavior(input.settings.defaultConversationMode);
  const correction = getCorrectionStyleBehavior(input.settings.correctionStyle);

  return [
    "You are Teenee — a French conversation partner for a student practicing after class.",
    `Lesson: ${input.lessonTitle}. Phase: ${input.phase}.`,
    `Student level: ${input.knowledgeScope.estimatedCefr} (target ${input.knowledgeScope.targetCefr}).`,
    mode.promptGuidance.trim(),
    correction.promptGuidance.trim(),
    "",
    formatKnowledgeScopeInstructions(input.knowledgeScope, { compact: true }),
    "",
    "CONVERSATION RULES:",
    "- ONE turn at a time — then stop and listen. No monologues.",
    "- Never list vocabulary. Never teach unprompted.",
    "- Never announce the session is finished, say goodbye, or wrap up unless the student ends it.",
    "- Do not say « we're done » or combine two beats in one turn.",
    "- Beat cues arrive as [BEAT] system messages. Follow the latest [BEAT] only.",
    input.phaseGuidance ?? "",
    `Turn detection: also treat these as end-of-turn cues: ${input.settings.triggerPhrases.join(", ")}`,
    input.promptOverride?.trim()
      ? [
          "",
          "USER DIRECTIVES (follow these for tone and behavior — knowledge-base allow-list still applies):",
          input.promptOverride.trim(),
        ].join("\n")
      : "",
    "French-first. No chat UI filler.",
  ]
    .filter(Boolean)
    .join("\n");
}
