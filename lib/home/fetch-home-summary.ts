import { getOrCreateWordOfTheDay } from "@/lib/home/get-or-create-word-of-the-day";
import { fetchProgressStats } from "@/lib/progress/fetch-progress-stats";
import { querySingle } from "@/lib/supabase/query-single";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { CefrLevel } from "@/types/common/cefr-level";
import type { HomeSummary } from "@/types/home/home-summary";

type UserProfileRow = {
  display_name: string;
  profile_setup_complete: boolean;
  current_cefr_estimate: string;
  target_cefr: string;
};

type LatestLessonRow = {
  id: string;
  title: string;
  status: string;
};

export async function fetchHomeSummary(
  supabase: ServerClient,
  userId: string,
): Promise<HomeSummary> {
  const [user, progress, lessonsResult] = await Promise.all([
    querySingle<UserProfileRow>(
      supabase
        .from("users")
        .select("display_name, profile_setup_complete, current_cefr_estimate, target_cefr")
        .eq("id", userId)
        .single(),
      "Could not load profile",
    ),
    fetchProgressStats(supabase, userId),
    supabase
      .from("lessons")
      .select("id, title, status")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1),
  ]);

  const level = user.current_cefr_estimate as CefrLevel;
  const wordOfTheDay = await getOrCreateWordOfTheDay(supabase, userId, level);

  const latest = (lessonsResult.data?.[0] as LatestLessonRow | undefined) ?? null;
  let latestLessonAction: HomeSummary["latestLessonAction"] = null;

  if (latest?.status === "parsed") {
    latestLessonAction = {
      href: `/lessons/${latest.id}/confirm`,
      label: "Review & confirm",
    };
  } else if (latest?.status === "confirmed") {
    latestLessonAction = { href: "/explain", label: "Continue session" };
  }

  return {
    displayName: user.display_name,
    profileSetupComplete: user.profile_setup_complete,
    currentLevel: level,
    targetLevel: user.target_cefr as CefrLevel,
    wordOfTheDay,
    streakDays: progress.streakDays,
    speakingTimeLabel: progress.speakingTimeLabel,
    nextSessionRecommendation: progress.nextSessionRecommendation,
    hasLessons: Boolean(latest),
    latestLessonTitle: latest?.title ?? null,
    latestLessonAction,
  };
}
