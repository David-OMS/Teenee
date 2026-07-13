import { buildVoiceInstructionsBundle } from "@/lib/realtime/build-voice-instructions-bundle";
import type { KnowledgeBaseScope } from "@/lib/realtime/build-knowledge-base-scope";
import type { AppSettings } from "@/lib/settings/app-settings";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

/** @deprecated Use buildVoiceInstructionsBundle — kept for imports. */
export function buildRealtimeInstructions(
  context: TurnContextSlice,
  settings: AppSettings,
  lessonTitle: string,
  knowledgeScope: KnowledgeBaseScope,
  promptOverride?: string,
  phaseGuidance?: string,
): string {
  return buildVoiceInstructionsBundle({
    context,
    settings,
    lessonTitle,
    knowledgeScope,
    promptOverride,
    phaseGuidance,
  }).instructions;
}
