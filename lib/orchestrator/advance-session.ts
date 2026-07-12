import { buildTurnContextSlice } from "@/lib/orchestrator/build-turn-context-slice";
import { fetchSessionById } from "@/lib/orchestrator/fetch-session-by-id";
import { findNextAgendaItem } from "@/lib/orchestrator/find-next-agenda-item";
import { getExplainPhaseGuidance } from "@/lib/orchestrator/explain-correction-policy";
import type { TurnOutcome } from "@/lib/orchestrator/should-advance-node";
import { shouldAdvanceNode } from "@/lib/orchestrator/should-advance-node";
import { fetchKnowledgeSnapshot } from "@/lib/knowledge/fetch-knowledge-snapshot";
import { fetchPracticeGraph } from "@/lib/practice-graph/fetch-practice-graph";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { CorrectionBudget } from "@/types/conversation/correction-budget";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

type AdvanceSessionInput = {
  sessionId: string;
  currentItemId: string;
  outcome: TurnOutcome;
  turnsOnNode: number;
  correctionBudget: CorrectionBudget;
};

type AdvanceSessionResult = {
  context: TurnContextSlice;
  advanced: boolean;
  completed: boolean;
  readyForPractice: boolean;
};

/** Advance session state and return the next turn context slice. */
export async function advanceSession(
  supabase: ServerClient,
  userId: string,
  input: AdvanceSessionInput,
): Promise<AdvanceSessionResult> {
  const session = await fetchSessionById(supabase, input.sessionId);

  if (!session.agenda) {
    throw new Error("Session agenda missing.");
  }

  const lastItem = session.agenda.items.at(-1);
  const completed = Boolean(
    lastItem &&
      input.currentItemId === lastItem.id &&
      input.outcome === "success" &&
      shouldAdvanceNode(lastItem.node, input.outcome, input.turnsOnNode),
  );

  const next = findNextAgendaItem({
    items: session.agenda.items,
    currentItemId: input.currentItemId,
    outcome: input.outcome,
    turnsOnNode: input.turnsOnNode,
  });

  const [practiceGraph, knowledge] = await Promise.all([
    fetchPracticeGraph(supabase, session.lesson_id),
    fetchKnowledgeSnapshot(supabase, userId, { todayLessonId: session.lesson_id }),
  ]);

  const context = buildTurnContextSlice({
    sessionId: session.id,
    agenda: session.agenda,
    currentItem: next.item,
    knowledge,
    phase: session.phase,
    correctionBudget: input.correctionBudget,
    turnsOnNode: next.turnsOnNode,
    graphNodes: practiceGraph.nodes,
    phaseGuidance: session.phase === "explain" ? getExplainPhaseGuidance() : undefined,
  });

  if (completed) {
    await supabase
      .from("sessions")
      .update({
        status: "completed",
        ended_at: new Date().toISOString(),
      })
      .eq("id", session.id);
  }

  return {
    context,
    advanced: next.advanced,
    completed,
    readyForPractice: completed && session.phase === "explain",
  };
}
