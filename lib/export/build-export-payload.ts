import type { ServerClient } from "@/lib/supabase/create-server-client";

export type ExportPayload = {
  exportedAt: string;
  version: "1.0";
  user: {
    id: string;
    displayName: string;
    targetCefr: string;
  };
  lessons: unknown[];
  knowledgeItems: unknown[];
  weaknesses: unknown[];
  sessions: unknown[];
};

export async function buildExportPayload(
  supabase: ServerClient,
  userId: string,
): Promise<ExportPayload> {
  const [userResult, lessonsResult, knowledgeResult, weaknessesResult, sessionsResult] =
    await Promise.all([
      supabase.from("users").select("id, display_name, target_cefr").eq("id", userId).single(),
      supabase.from("lessons").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("knowledge_items").select("*").eq("user_id", userId).order("created_at"),
      supabase.from("learning_weaknesses").select("*").eq("user_id", userId).order("created_at"),
      supabase
        .from("sessions")
        .select("id, lesson_id, phase, status, started_at, ended_at, duration_seconds, review")
        .eq("user_id", userId)
        .order("started_at", { ascending: false }),
    ]);

  if (userResult.error || !userResult.data) {
    throw new Error(`Could not load user: ${userResult.error?.message ?? "unknown"}`);
  }

  return {
    exportedAt: new Date().toISOString(),
    version: "1.0",
    user: {
      id: userResult.data.id,
      displayName: userResult.data.display_name,
      targetCefr: userResult.data.target_cefr,
    },
    lessons: lessonsResult.data ?? [],
    knowledgeItems: knowledgeResult.data ?? [],
    weaknesses: weaknessesResult.data ?? [],
    sessions: sessionsResult.data ?? [],
  };
}
