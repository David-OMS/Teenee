import { fetchSessionById } from "@/lib/orchestrator/fetch-session-by-id";
import { fetchSessionContext } from "@/lib/orchestrator/fetch-session-context";
import { getExplainPhaseGuidance } from "@/lib/orchestrator/explain-correction-policy";
import { buildKnowledgeBaseScope } from "@/lib/realtime/build-knowledge-base-scope";
import { buildStableVoiceInstructions } from "@/lib/realtime/build-stable-voice-instructions";
import { buildTurnBeatMessage } from "@/lib/realtime/build-turn-beat-message";
import { buildVoiceInstructionsBundle } from "@/lib/realtime/build-voice-instructions-bundle";
import { fetchConfirmedLessonContent } from "@/lib/lessons/fetch-confirmed-lesson-content";
import { fetchKnowledgeSnapshot } from "@/lib/knowledge/fetch-knowledge-snapshot";
import { fetchUserSettings } from "@/lib/settings/fetch-user-settings";
import type { ServerClient } from "@/lib/supabase/create-server-client";

export type VoiceInstructionsResult = {
  instructions: string;
  stable: string;
  turnBeat: string;
  lessonTitle: string;
};

export async function buildInstructionsForSession(
  supabase: ServerClient,
  userId: string,
  sessionId: string,
  options: {
    currentItemId?: string;
    turnsOnNode?: number;
    promptOverride?: string;
    beatOnly?: boolean;
    stableOnly?: boolean;
  } = {},
): Promise<VoiceInstructionsResult> {
  const session = await fetchSessionById(supabase, sessionId);

  const [sessionContext, settings, todayLesson, knowledge, lessonCountResult] = await Promise.all([
    fetchSessionContext(supabase, userId, sessionId, options),
    fetchUserSettings(),
    fetchConfirmedLessonContent(supabase, session.lesson_id),
    fetchKnowledgeSnapshot(supabase, userId, { todayLessonId: session.lesson_id }),
    supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "confirmed"),
  ]);

  const knowledgeScope = buildKnowledgeBaseScope({
    knowledge,
    todayLesson,
    targetCefr: settings.targetCefr,
    confirmedLessonCount: lessonCountResult.count ?? 1,
  });

  const phaseGuidance =
    sessionContext.context.phase === "explain" ? getExplainPhaseGuidance() : undefined;

  if (options.beatOnly) {
    const turnBeat = buildTurnBeatMessage(sessionContext.context, knowledgeScope);
    const stable = buildStableVoiceInstructions({
      settings,
      lessonTitle: sessionContext.lessonTitle,
      knowledgeScope,
      phase: sessionContext.context.phase,
      phaseGuidance,
      promptOverride: options.promptOverride,
    });

    return {
      instructions: turnBeat,
      stable,
      turnBeat,
      lessonTitle: sessionContext.lessonTitle,
    };
  }

  if (options.stableOnly) {
    const stable = buildStableVoiceInstructions({
      settings,
      lessonTitle: sessionContext.lessonTitle,
      knowledgeScope,
      phase: sessionContext.context.phase,
      phaseGuidance,
      promptOverride: options.promptOverride,
    });

    const turnBeat = buildTurnBeatMessage(sessionContext.context, knowledgeScope);

    return {
      instructions: stable,
      stable,
      turnBeat,
      lessonTitle: sessionContext.lessonTitle,
    };
  }

  const bundle = buildVoiceInstructionsBundle({
    context: sessionContext.context,
    settings,
    lessonTitle: sessionContext.lessonTitle,
    knowledgeScope,
    promptOverride: options.promptOverride,
    phaseGuidance,
  });

  return {
    instructions: bundle.instructions,
    stable: bundle.stable,
    turnBeat: bundle.turnBeat,
    lessonTitle: sessionContext.lessonTitle,
  };
}
