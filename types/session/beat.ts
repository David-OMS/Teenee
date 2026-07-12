import type { EntityId } from "@/types/common/entity-id";

/** Soft conversational landmark — pulls dialogue back without rigid scripting. */
export type Beat = {
  id: EntityId;
  label: string;
  nodeId: EntityId;
  completed: boolean;
};
