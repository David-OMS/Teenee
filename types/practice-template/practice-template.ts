import type { TemplateId, TemplateSlotKind } from "@/types/practice-template/template-id";
import type { TemplateSlot } from "@/types/practice-template/template-slot";

/** Reusable conversation topology — a shape, not a prompt. */
export type PracticeTemplate = {
  id: TemplateId;
  name: string;
  description: string;
  slots: TemplateSlot[];
  matchKeywords: string[];
};

export type { TemplateSlotKind };
