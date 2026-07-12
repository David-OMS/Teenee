/** Active Recall Mode rules for recall_gap nodes. */
export type ActiveRecallRules = {
  silenceSeconds: number;
  hintAfterSeconds: number;
  expectedProduction?: string;
};
