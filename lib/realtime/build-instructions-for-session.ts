import { buildRealtimeInstructions } from "@/lib/realtime/build-realtime-instructions";
import { fetchSessionById } from "@/lib/orchestrator/fetch-session-by-id";
import { fetchSessionContext } from "@/lib/orchestrator/fetch-session-context";
import { buildKnowledgeBaseScope } from "@/lib/realtime/build-knowledge-base-scope";
import { fetchConfirmedLessonContent } from "@/lib/lessons/fetch-confirmed-lesson-content";
import { fetchKnowledgeSnapshot } from "@/lib/knowledge/fetch-knowledge-snapshot";
import { fetchUserSettings } from "@/lib/settings/fetch-user-settings";
import type { ServerClient } from "@/lib/supabase/create-server-client";

export async function buildInstructionsForSession(
  supabase: ServerClient,
  userId: string,
  sessionId: string,
  options: { currentItemId?: string; turnsOnNode?: number } = {},
): Promise<{ instructions: string; lessonTitle: string }> {
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

  const instructions = buildRealtimeInstructions(
    sessionContext.context,
    settings,
    sessionContext.lessonTitle,
    knowledgeScope,
  );

  return { instructions, lessonTitle: sessionContext.lessonTitle };
}
