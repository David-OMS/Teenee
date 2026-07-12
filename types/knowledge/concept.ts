import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { ConceptConfidence } from "@/types/knowledge/concept-confidence";
import type { ConceptKind } from "@/types/knowledge/concept-kind";
import type { MasteryLevel } from "@/types/knowledge/mastery-level";

/** Base Knowledge Graph node — every concept links back to a lesson. */
export type Concept = {
  id: EntityId;
  userId: EntityId;
  lessonId: EntityId;
  kind: ConceptKind;
  label: string;
  mastery: MasteryLevel;
  confidence: ConceptConfidence;
  reviewScheduleId: EntityId;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
};
