import type { EntityId } from "@/types/common/entity-id";
import type { IsoDateTime } from "@/types/common/iso-datetime";
import type { SessionPhase, SessionStatus } from "@/types/session/session-phase";

export type Session = {
  id: EntityId;
  userId: EntityId;
  lessonId: EntityId;
  agendaId: EntityId;
  phase: SessionPhase;
  status: SessionStatus;
  startedAt: IsoDateTime;
  endedAt?: IsoDateTime;
  durationSeconds?: number;
};
