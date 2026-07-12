export type ConfidenceScore = number;

export type ConceptConfidence = {
  speaking: ConfidenceScore;
  recognition: ConfidenceScore;
  pronunciation: ConfidenceScore;
};
