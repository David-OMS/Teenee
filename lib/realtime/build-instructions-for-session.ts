import { buildRealtimeInstructions } from "@/lib/realtime/build-realtime-instructions";
import { fetchSessionContext } from "@/lib/orchestrator/fetch-session-context";
import { fetchUserSettings } from "@/lib/settings/fetch-user-settings";
import type { ServerClient } from "@/lib/supabase/create-server-client";

export async function buildInstructionsForSession(
  supabase: ServerClient,
  userId: string,
  sessionId: string,
): Promise<{ instructions: string; lessonTitle: string }> {
  const [sessionContext, settings] = await Promise.all([
    fetchSessionContext(supabase, userId, sessionId),
    fetchUserSettings(),
  ]);

  const instructions = buildRealtimeInstructions(
    sessionContext.context,
    settings,
    sessionContext.lessonTitle,
  );

  return { instructions, lessonTitle: sessionContext.lessonTitle };
}
