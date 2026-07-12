import type { ConversationMode } from "@/types/conversation/conversation-mode";
import type { CorrectionStyle } from "@/types/user/correction-style";

export type AppSettings = {
  userId: string;
  defaultConversationMode: ConversationMode;
  correctionStyle: CorrectionStyle;
  targetCefr: string;
  silenceTimeoutSeconds: number;
  triggerPhrases: string[];
  transcriptVisible: boolean;
};

export type AppSettingsPatch = Partial<
  Pick<
    AppSettings,
    | "defaultConversationMode"
    | "correctionStyle"
    | "targetCefr"
    | "silenceTimeoutSeconds"
    | "triggerPhrases"
    | "transcriptVisible"
  >
>;
