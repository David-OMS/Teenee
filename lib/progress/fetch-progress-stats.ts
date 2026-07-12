import {
  calculateSpeakingStreak,
  extractSessionEndDates,
} from "@/lib/progress/calculate-speaking-streak";
import { formatSpeakingDuration } from "@/lib/progress/format-speaking-duration";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { ProgressStats } from "@/types/progress/progress-stats";
import type { SessionReview } from "@/types/session/session-review";

type SessionDurationRow = {
  duration_seconds: number | null;
  ended_at: string | null;
  review: SessionReview | null;
};

type WeaknessRow = {
  description: string;
  occurrence_count: number;
};

type KnowledgeRow = {
  label: string;
  mastery: number;
};

export async function fetchProgressStats(
  supabase: ServerClient,
  userId: string,
): Promise<ProgressStats> {
  const [sessionsResult, lessonResult, weaknessesResult, knowledgeResult] = await Promise.all([
    supabase
      .from("sessions")
      .select("duration_seconds, ended_at, review")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("ended_at", { ascending: false })
      .limit(120),
    supabase
      .from("lessons")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "confirmed"),
    supabase
      .from("learning_weaknesses")
      .select("description, occurrence_count")
      .eq("user_id", userId)
      .order("occurrence_count", { ascending: false })
      .limit(5),
    supabase
      .from("knowledge_items")
      .select("label, mastery")
      .eq("user_id", userId)
      .order("mastery", { ascending: false })
      .limit(5),
  ]);

  const sessions = (sessionsResult.data ?? []) as SessionDurationRow[];
  const speakingTimeSeconds = sessions.reduce(
    (total, session) => total + (session.duration_seconds ?? 0),
    0,
  );

  const streakDays = calculateSpeakingStreak(extractSessionEndDates(sessions));

  const weakestTopics = ((weaknessesResult.data ?? []) as WeaknessRow[]).map(
    (row) => row.description,
  );

  const strongestTopics = ((knowledgeResult.data ?? []) as KnowledgeRow[])
    .filter((row) => row.mastery >= 2)
    .map((row) => row.label);

  const latestRecommendation = sessions.find(
    (session) => (session.review?.nextSessionRecommendations.length ?? 0) > 0,
  )?.review?.nextSessionRecommendations[0];

  return {
    speakingTimeSeconds,
    speakingTimeLabel: formatSpeakingDuration(speakingTimeSeconds),
    lessonCount: lessonResult.count ?? 0,
    streakDays,
    weakestTopics,
    strongestTopics,
    nextSessionRecommendation: latestRecommendation ?? null,
  };
}
