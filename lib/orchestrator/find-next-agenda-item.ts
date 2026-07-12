import type { AgendaItem } from "@/types/session/agenda-item";
import type { TurnOutcome } from "@/lib/orchestrator/should-advance-node";
import { shouldAdvanceNode } from "@/lib/orchestrator/should-advance-node";

type FindNextAgendaItemInput = {
  items: AgendaItem[];
  currentItemId: string;
  outcome: TurnOutcome;
  turnsOnNode: number;
};

export function findNextAgendaItem(input: FindNextAgendaItemInput): {
  item: AgendaItem;
  advanced: boolean;
  turnsOnNode: number;
} {
  const currentIndex = input.items.findIndex((item) => item.id === input.currentItemId);
  const currentItem = input.items[currentIndex];

  if (!currentItem) {
    throw new Error("Current agenda item not found.");
  }

  const canAdvance = shouldAdvanceNode(currentItem.node, input.outcome, input.turnsOnNode);

  if (!canAdvance) {
    return {
      item: currentItem,
      advanced: false,
      turnsOnNode: input.turnsOnNode + 1,
    };
  }

  const nextItem = input.items[currentIndex + 1] ?? currentItem;

  return {
    item: nextItem,
    advanced: currentIndex + 1 < input.items.length,
    turnsOnNode: nextItem.id === currentItem.id ? input.turnsOnNode + 1 : 1,
  };
}
