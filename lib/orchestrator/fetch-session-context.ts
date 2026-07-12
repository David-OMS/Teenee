import { buildTurnContextSlice } from "@/lib/orchestrator/build-turn-context-slice";
import { fetchSessionById } from "@/lib/orchestrator/fetch-session-by-id";
import { getCorrectionBudgetForPhase } from "@/lib/orchestrator/get-correction-budget-for-phase";
import { getExplainPhaseGuidance } from "@/lib/orchestrator/explain-correction-policy";
import { fetchConfirmedLessonContent } from "@/lib/lessons/fetch-confirmed-lesson-content";
import { fetchKnowledgeSnapshot } from "@/lib/knowledge/fetch-knowledge-snapshot";
import { fetchPracticeGraph } from "@/lib/practice-graph/fetch-practice-graph";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

type FetchSessionContextOptions = {
  currentItemId?: string;
  turnsOnNode?: number;
};

export async function fetchSessionContext(
  supabase: ServerClient,
  userId: string,
  sessionId: string,
  options: FetchSessionContextOptions = {},
): Promise<{
  sessionId: string;
  lessonId: string;
  lessonTitle: string;
  phase: string;
  context: TurnContextSlice;
}> {
  const session = await fetchSessionById(supabase, sessionId);

  if (!session.agenda?.items[0]) {
    throw new Error("Session agenda is empty.");
  }

  const currentItem =
    session.agenda.items.find((item) => item.id === options.currentItemId) ??
    session.agenda.items[0];

  const [practiceGraph, knowledge, confirmedContent] = await Promise.all([
    fetchPracticeGraph(supabase, session.lesson_id),
    fetchKnowledgeSnapshot(supabase, userId, { todayLessonId: session.lesson_id }),
    fetchConfirmedLessonContent(supabase, session.lesson_id),
  ]);

  const context = buildTurnContextSlice({
    sessionId: session.id,
    agenda: session.agenda,
    currentItem,
    knowledge,
    phase: session.phase,
    correctionBudget: getCorrectionBudgetForPhase(session.phase),
    turnsOnNode: options.turnsOnNode ?? 1,
    graphNodes: practiceGraph.nodes,
    phaseGuidance: session.phase === "explain" ? getExplainPhaseGuidance() : undefined,
  });

  return {
    sessionId: session.id,
    lessonId: session.lesson_id,
    lessonTitle: confirmedContent.title,
    phase: session.phase,
    context,
  };
}
