import type {
  PracticeNodeKind,
  PracticeNodeWeight,
} from "@/types/practice-graph/practice-node-kind";
import type { TemplateSlotKind } from "@/types/practice-template/template-id";

export type TemplateSlot = {
  id: string;
  kind: TemplateSlotKind;
  nodeKind: PracticeNodeKind;
  weight: PracticeNodeWeight;
  objectiveTemplate: string;
  promptTemplate: string;
  recallGap?: {
    silenceSeconds: number;
    hintAfterSeconds: number;
  };
};
