import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { Correction } from "@/types/conversation/correction";
import type { ConversationTurn } from "@/types/conversation/conversation-turn";

export type ConversationSummary = {
  sessionId: EntityId;
  turns: ConversationTurn[];
  corrections: Correction[];
  vocabularyUsed: string[];
  summarizedAt: IsoDateTime;
};
