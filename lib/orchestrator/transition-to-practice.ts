import { fetchSessionById } from "@/lib/orchestrator/fetch-session-by-id";
import { startSession } from "@/lib/orchestrator/start-session";
import type { ServerClient } from "@/lib/supabase/create-server-client";

type TransitionToPracticeResult = Awaited<ReturnType<typeof startSession>>;

/** Complete Explain Mode and start Practice with the same lesson. */
export async function transitionToPractice(
  supabase: ServerClient,
  userId: string,
  explainSessionId: string,
): Promise<TransitionToPracticeResult> {
  const explainSession = await fetchSessionById(supabase, explainSessionId);

  if (explainSession.phase !== "explain") {
    throw new Error("Session is not in Explain Mode.");
  }

  await supabase
    .from("sessions")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
    })
    .eq("id", explainSessionId);

  return startSession(supabase, {
    userId,
    lessonId: explainSession.lesson_id,
    phase: "practice",
  });
}
