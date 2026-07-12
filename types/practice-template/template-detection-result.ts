import type { TemplateId } from "@/types/practice-template/template-id";

export type TemplateDetectionResult = {
  primary: TemplateId;
  secondary?: TemplateId;
  confidence: number;
};
