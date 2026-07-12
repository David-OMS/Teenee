export type TurnDetectionConfig = {
  silenceTimeoutSeconds: number;
  triggerPhrases: string[];
};

export const DEFAULT_TURN_DETECTION: TurnDetectionConfig = {
  silenceTimeoutSeconds: 5,
  triggerPhrases: ["Your turn.", "Go ahead.", "That's all."],
};
