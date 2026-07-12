import type { ConversationMode } from "@/types/conversation/conversation-mode";
import type { TurnDetectionConfig } from "@/types/conversation/turn-detection-config";

export type ConversationSettings = {
  mode: ConversationMode;
  turnDetection: TurnDetectionConfig;
  showTranscript: boolean;
};
