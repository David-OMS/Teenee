import { randomUUID } from "crypto";

export function createLessonId(): string {
  return randomUUID();
}
