import { buildConceptDraftsFromLesson } from "@/lib/knowledge/build-concept-drafts-from-lesson";
import { seedWeaknessesFromConcepts } from "@/lib/knowledge/seed-weaknesses-from-concepts";
import {
  findExistingKnowledgeItem,
  insertKnowledgeItem,
  type KnowledgeItemRow,
} from "@/lib/knowledge/upsert-knowledge-item";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";
import type { ServerClient } from "@/lib/supabase/create-server-client";

/** Merge confirmed lesson concepts into the Knowledge Graph (dedupe by normalized form). */
export async function upsertKnowledgeFromLesson(
  supabase: ServerClient,
  userId: string,
  lessonId: string,
  content: ConfirmedLessonContent,
): Promise<KnowledgeItemRow[]> {
  const drafts = buildConceptDraftsFromLesson(content);
  const upserted: KnowledgeItemRow[] = [];
  const created: KnowledgeItemRow[] = [];

  for (const draft of drafts) {
    const normalizedForm = draft.payload.normalizedForm;
    if (!normalizedForm) {
      continue;
    }

    const existing = await findExistingKnowledgeItem(
      supabase,
      userId,
      draft.kind,
      normalizedForm,
    );

    if (existing) {
      upserted.push(existing);
      continue;
    }

    const inserted = await insertKnowledgeItem(supabase, userId, lessonId, draft);
    upserted.push(inserted);
    created.push(inserted);
  }

  await seedWeaknessesFromConcepts(supabase, userId, created);
  return upserted;
}
