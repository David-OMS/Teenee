import type { EntityId } from "@/types/common/entity-id";

export type ParsedGrammarItem = {
  id: EntityId;
  topic: string;
  description: string;
  examples: string[];
};
