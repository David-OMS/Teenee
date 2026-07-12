import type { EntityId } from "@/types/common/entity-id";

export type ParsedVocabularyItem = {
  id: EntityId;
  french: string;
  english: string;
  notes?: string;
};
