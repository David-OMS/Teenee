import type { CefrLevel } from "@/types/common/cefr-level";
import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { ConversationMode } from "@/types/conversation/conversation-mode";
import type { CorrectionStyle } from "@/types/user/correction-style";
import type { UserGoal } from "@/types/user/user-goal";

/** Layer 1 — permanent profile preferences. */
export type UserProfile = {
  id: EntityId;
  displayName: string;
  targetCefr: CefrLevel;
  currentCefrEstimate: CefrLevel;
  correctionStyle: CorrectionStyle;
  defaultConversationMode: ConversationMode;
  interests: string[];
  goals: UserGoal[];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};
