import { randomUUID } from "crypto";

export function createEntityId(): string {
  return randomUUID();
}
