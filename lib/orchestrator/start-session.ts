import { buildExplainSessionAgenda } from "@/lib/orchestrator/build-explain-session-agenda";
import { buildSessionAgenda } from "@/lib/orchestrator/build-session-agenda";
import { buildTurnContextSlice } from "@/lib/orchestrator/build-turn-context-slice";
import { getCorrectionBudgetForPhase } from "@/lib/orchestrator/get-correction-budget-for-phase";
import { getExplainPhaseGuidance } from "@/lib/orchestrator/explain-correction-policy";
import { fetchConfirmedLessonContent } from "@/lib/lessons/fetch-confirmed-lesson-content";
import { fetchKnowledgeItemsForUser } from "@/lib/knowledge/fetch-knowledge-items-for-user";
import { fetchKnowledgeSnapshot } from "@/lib/knowledge/fetch-knowledge-snapshot";
import { fetchPracticeGraph } from "@/lib/practice-graph/fetch-practice-graph";
import { createEntityId } from "@/lib/practice-graph/create-entity-id";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { SessionAgenda } from "@/types/session/session-agenda";
import type { SessionPhase } from "@/types/session/session-phase";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

type StartSessionInput = {
  userId: string;
  lessonId: string;
  phase?: SessionPhase;
};

type StartSessionResult = {
  sessionId: string;
  agendaId: string;
  lessonId: string;
  phase: SessionPhase;
  agenda: SessionAgenda;
  context: TurnContextSlice;
  lessonTitle: string;
};

async function buildAgendaForPhase(
  phase: SessionPhase,
  input: {
    sessionId: string;
    lessonId: string;
    userId: string;
    practiceGraph: Awaited<ReturnType<typeof fetchPracticeGraph>>;
    knowledge: Awaited<ReturnType<typeof fetchKnowledgeSnapshot>>;
    allKnowledgeItems: Awaited<ReturnType<typeof fetchKnowledgeItemsForUser>>;
    confirmedContent: Awaited<ReturnType<typeof fetchConfirmedLessonContent>>;
  },
) {
  if (phase === "explain") {
    return buildExplainSessionAgenda({
      sessionId: input.sessionId,
      lessonId: input.lessonId,
      content: input.confirmedContent,
      practiceGraph: input.practiceGraph,
      knowledge: input.knowledge,
    });
  }

  return buildSessionAgenda({
    sessionId: input.sessionId,
    lessonId: input.lessonId,
    practiceGraph: input.practiceGraph,
    knowledge: input.knowledge,
    allKnowledgeItems: input.allKnowledgeItems,
  });
}

/** Orchestrator — build agenda and persist a new voice session. */
export async function startSession(
  supabase: ServerClient,
  input: StartSessionInput,
): Promise<StartSessionResult> {
  const phase = input.phase ?? "practice";
  const sessionId = createEntityId();
  const agendaId = createEntityId();

  const [practiceGraph, knowledge, allKnowledgeItems, confirmedContent] = await Promise.all([
    fetchPracticeGraph(supabase, input.lessonId),
    fetchKnowledgeSnapshot(supabase, input.userId, { todayLessonId: input.lessonId }),
    fetchKnowledgeItemsForUser(supabase, input.userId),
    fetchConfirmedLessonContent(supabase, input.lessonId),
  ]);

  const agenda = await buildAgendaForPhase(phase, {
    sessionId,
    lessonId: input.lessonId,
    userId: input.userId,
    practiceGraph,
    knowledge,
    allKnowledgeItems,
    confirmedContent,
  });

  const { error } = await supabase.from("sessions").insert({
    id: sessionId,
    user_id: input.userId,
    lesson_id: input.lessonId,
    agenda_id: agendaId,
    agenda,
    phase,
    status: "active",
  });

  if (error) {
    throw new Error(`Could not start session: ${error.message}`);
  }

  const firstItem = agenda.items[0];
  if (!firstItem) {
    throw new Error("Session agenda has no items.");
  }

  const context = buildTurnContextSlice({
    sessionId,
    agenda,
    currentItem: firstItem,
    knowledge,
    phase,
    correctionBudget: getCorrectionBudgetForPhase(phase),
    turnsOnNode: 1,
    graphNodes: practiceGraph.nodes,
    phaseGuidance: phase === "explain" ? getExplainPhaseGuidance() : undefined,
  });

  return {
    sessionId,
    agendaId,
    lessonId: input.lessonId,
    phase,
    agenda,
    context,
    lessonTitle: confirmedContent.title,
  };
}
