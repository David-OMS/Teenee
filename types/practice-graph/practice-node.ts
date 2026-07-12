import type { EntityId } from "@/types/common/entity-id";
import type {
  PracticeNodeKind,
  PracticeNodeWeight,
} from "@/types/practice-graph/practice-node-kind";

/** Conversational building block — generated from a lesson via template compilation. */
export type PracticeNode = {
  id: EntityId;
  kind: PracticeNodeKind;
  weight: PracticeNodeWeight;
  templateId: string;
  objective: string;
  targetConceptIds: EntityId[];
  prompts: string[];
  expectedProduction?: string;
  silenceSeconds?: number;
  hintAfterSeconds?: number;
  anchorPhrase?: string;
  order: number;
};
