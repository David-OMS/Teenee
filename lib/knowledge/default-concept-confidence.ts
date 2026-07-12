import type { ConceptConfidence } from "@/types/knowledge/concept-confidence";

export function defaultConceptConfidence(): ConceptConfidence {
  return {
    speaking: 0,
    recognition: 0,
    pronunciation: 0,
  };
}
