import { buildStableVoiceInstructions } from "@/lib/realtime/build-stable-voice-instructions";
import { buildTurnBeatMessage } from "@/lib/realtime/build-turn-beat-message";
import type { KnowledgeBaseScope } from "@/lib/realtime/build-knowledge-base-scope";
import type { AppSettings } from "@/lib/settings/app-settings";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

/** Full instructions for budget voice or initial realtime connect. */
export function buildVoiceInstructionsBundle(input: {
  context: TurnContextSlice;
  settings: AppSettings;
  lessonTitle: string;
  knowledgeScope: KnowledgeBaseScope;
  promptOverride?: string;
  phaseGuidance?: string;
}) {
  const stable = buildStableVoiceInstructions({
    settings: input.settings,
    lessonTitle: input.lessonTitle,
    knowledgeScope: input.knowledgeScope,
    phase: input.context.phase,
    phaseGuidance: input.phaseGuidance,
    promptOverride: input.promptOverride,
  });
  const turnBeat = buildTurnBeatMessage(input.context, input.knowledgeScope);

  return {
    stable,
    turnBeat,
    instructions: `${stable}\n\n${turnBeat}`,
  };
}
