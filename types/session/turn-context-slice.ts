import type { CorrectionBudget } from "@/types/conversation/correction-budget";
import type { EntityId } from "@/types/common/entity-id";
import type { AgendaItem } from "@/types/session/agenda-item";
import type { ActiveRecallRules } from "@/types/session/active-recall-rules";
import type { Beat } from "@/types/session/beat";
import type { SessionPhase } from "@/types/session/session-phase";

/** Lightweight slice passed to Realtime on each turn — not a full recalculation. */
export type TurnContextSlice = {
  currentItem: AgendaItem;
  currentBeat?: Beat;
  anchorPhrase?: string;
  weaknessHint?: string;
  correctionBudget: CorrectionBudget;
  activeRecall?: ActiveRecallRules;
  phaseGuidance?: string;
  phase: SessionPhase;
  turnsOnNode: number;
  sessionId: EntityId;
};
