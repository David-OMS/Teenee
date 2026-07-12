import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { AgendaItem } from "@/types/session/agenda-item";
import type { Beat } from "@/types/session/beat";
import type { PronunciationFocus } from "@/types/session/pronunciation-focus";

/** Pre-computed plan — orchestrator output, built before the session starts. */
export type SessionAgenda = {
  id: EntityId;
  sessionId: EntityId;
  lessonId: EntityId;
  items: AgendaItem[];
  beats: Beat[];
  pronunciationFocus: PronunciationFocus;
  distribution: {
    revision: number;
    stretch: number;
    discovery: number;
  };
  createdAt: IsoDateTime;
};
