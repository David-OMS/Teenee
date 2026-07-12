import type { PracticeEdge } from "@/types/practice-graph/practice-edge";
import type { PracticeNode } from "@/types/practice-graph/practice-node";
import type { TemplateId } from "@/types/practice-template/template-id";

export type TemplateInstantiationResult = {
  templateId: TemplateId;
  nodes: Omit<PracticeNode, "id">[];
  edges: Omit<PracticeEdge, "id">[];
  pronunciationFocus: string;
};
