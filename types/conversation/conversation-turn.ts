import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { Correction } from "@/types/conversation/correction";

export type ConversationTurn = {
  role: "student" | "assistant";
  french: string;
  english?: string;
  grammarNote?: string;
  pronunciationNote?: string;
  corrections: Correction[];
  timestamp: IsoDateTime;
};
