import type { Concept } from "@/types/knowledge/concept";

export type Grammar = Concept & {
  kind: "grammar";
  topic: string;
  description: string;
  commonMistakes: string[];
};
