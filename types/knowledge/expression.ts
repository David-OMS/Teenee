import type { Concept } from "@/types/knowledge/concept";

export type Expression = Concept & {
  kind: "expression";
  french: string;
  english: string;
  register: "formal" | "informal" | "neutral";
};
