import type { SessionPhase } from "@/types/session/session-phase";
import type { CorrectionBudget } from "@/types/conversation/correction-budget";
import { DEFAULT_CORRECTION_BUDGET } from "@/types/conversation/correction-budget";

/** Phase-specific correction limits — Explain Mode is lighter than Practice. */
export function getCorrectionBudgetForPhase(phase: SessionPhase): CorrectionBudget {
  if (phase === "explain") {
    return {
      maxGrammar: 1,
      maxPronunciation: 0,
      grammarUsed: 0,
      pronunciationUsed: 0,
    };
  }

  return { ...DEFAULT_CORRECTION_BUDGET };
}
