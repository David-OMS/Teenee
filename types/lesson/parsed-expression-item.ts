import type { EntityId } from "@/types/common/entity-id";

export type ParsedExpressionItem = {
  id: EntityId;
  french: string;
  english: string;
  register?: "formal" | "informal" | "neutral";
};
