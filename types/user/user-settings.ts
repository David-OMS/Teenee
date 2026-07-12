import type { EntityId } from "@/types/common/entity-id";

export type UserSettings = {
  userId: EntityId;
  silenceTimeoutSeconds: number;
  triggerPhrases: string[];
  transcriptVisible: boolean;
};
