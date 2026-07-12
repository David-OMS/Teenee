import type { Concept } from "@/types/knowledge/concept";

export type Vocabulary = Concept & {
  kind: "vocabulary";
  french: string;
  english: string;
  normalizedForm: string;
};
