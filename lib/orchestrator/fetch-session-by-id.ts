import { querySingle } from "@/lib/supabase/query-single";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { SessionAgenda } from "@/types/session/session-agenda";
import type { SessionPhase, SessionStatus } from "@/types/session/session-phase";

export type SessionRecord = {
  id: string;
  user_id: string;
  lesson_id: string;
  agenda_id: string;
  agenda: SessionAgenda | null;
  phase: SessionPhase;
  status: SessionStatus;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
};

export async function fetchSessionById(
  supabase: ServerClient,
  sessionId: string,
): Promise<SessionRecord> {
  return querySingle<SessionRecord>(
    supabase.from("sessions").select("*").eq("id", sessionId).single(),
    "Session not found",
  );
}
