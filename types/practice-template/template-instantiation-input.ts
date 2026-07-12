import type { TemplateId } from "@/types/practice-template/template-id";

export type TemplateInstantiationInput = {
  templateId: TemplateId;
  lessonTitle: string;
  vocabulary: { french: string; english: string }[];
  grammar: { topic: string; description: string }[];
  expressions: { french: string; english: string; register?: string }[];
  pronunciationTargets: string[];
};
