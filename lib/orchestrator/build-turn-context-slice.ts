import { buildActiveRecallRules } from "@/lib/orchestrator/build-active-recall-rules";
import { findNearestAnchorPhrase } from "@/lib/orchestrator/build-session-beats";
import type { CorrectionBudget } from "@/types/conversation/correction-budget";
import type { KnowledgeSnapshot } from "@/types/knowledge/knowledge-snapshot";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { AgendaItem } from "@/types/session/agenda-item";
import type { Beat } from "@/types/session/beat";
import type { SessionAgenda } from "@/types/session/session-agenda";
import type { SessionPhase } from "@/types/session/session-phase";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

type BuildTurnContextInput = {
  sessionId: string;
  agenda: SessionAgenda;
  currentItem: AgendaItem;
  knowledge: KnowledgeSnapshot;
  phase: SessionPhase;
  correctionBudget: CorrectionBudget;
  turnsOnNode: number;
  graphNodes: PracticeNode[];
  phaseGuidance?: string;
};

function findWeaknessHint(
  knowledge: KnowledgeSnapshot,
  conceptIds: string[],
): string | undefined {
  const weakness = knowledge.weaknesses.find((item) =>
    item.conceptId ? conceptIds.includes(item.conceptId) : false,
  );

  return weakness?.description;
}

function findCurrentBeat(beats: Beat[], nodeId: string): Beat | undefined {
  return beats.find((beat) => beat.nodeId === nodeId && !beat.completed);
}

/** Lightweight per-turn context — current node, anchor, weakness, correction budget. */
export function buildTurnContextSlice(input: BuildTurnContextInput): TurnContextSlice {
  const { currentItem } = input;

  return {
    sessionId: input.sessionId,
    currentItem,
    currentBeat: findCurrentBeat(input.agenda.beats, currentItem.node.id),
    anchorPhrase: findNearestAnchorPhrase(input.graphNodes, currentItem.node.id),
    weaknessHint: findWeaknessHint(input.knowledge, currentItem.conceptIds),
    correctionBudget: input.correctionBudget,
    activeRecall: buildActiveRecallRules(currentItem.node),
    phaseGuidance: input.phaseGuidance,
    phase: input.phase,
    turnsOnNode: input.turnsOnNode,
  };
}
