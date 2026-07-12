import { fetchDueReviews } from "@/lib/knowledge/fetch-due-reviews";
import { fetchKnowledgeItemsForUser } from "@/lib/knowledge/fetch-knowledge-items-for-user";
import { fetchLearningWeaknesses } from "@/lib/knowledge/fetch-learning-weaknesses";
import { querySingle } from "@/lib/supabase/query-single";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { CefrLevel } from "@/types/common/cefr-level";
import type { KnowledgeSnapshot } from "@/types/knowledge/knowledge-snapshot";

type FetchKnowledgeSnapshotOptions = {
  todayLessonId?: string;
};

type UserCefrRow = {
  current_cefr_estimate: string;
};

/** Build orchestrator-ready knowledge snapshot. */
export async function fetchKnowledgeSnapshot(
  supabase: ServerClient,
  userId: string,
  options: FetchKnowledgeSnapshotOptions = {},
): Promise<KnowledgeSnapshot> {
  const [items, dueReviews, weaknesses, user] = await Promise.all([
    fetchKnowledgeItemsForUser(supabase, userId, options.todayLessonId),
    fetchDueReviews(supabase, userId),
    fetchLearningWeaknesses(supabase, userId),
    querySingle<UserCefrRow>(
      supabase.from("users").select("current_cefr_estimate").eq("id", userId).single(),
      "Could not load user profile",
    ),
  ]);

  return {
    userId,
    todayLessonId: options.todayLessonId,
    items,
    dueReviews,
    weaknesses,
    estimatedCefr: user.current_cefr_estimate as CefrLevel,
  };
}
