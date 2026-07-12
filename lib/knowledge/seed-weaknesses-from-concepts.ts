import { upsertLearningWeakness } from "@/lib/knowledge/upsert-learning-weakness";
import type { KnowledgeItemRow } from "@/lib/knowledge/upsert-knowledge-item";
import type { ServerClient } from "@/lib/supabase/create-server-client";

function weaknessCategoryForKind(
  kind: KnowledgeItemRow["kind"],
): "grammar" | "pronunciation" | "vocabulary" | "register" {
  if (kind === "grammar") {
    return "grammar";
  }

  if (kind === "expression") {
    return "register";
  }

  return "vocabulary";
}

/** Seed initial weaknesses from newly upserted grammar and expression concepts. */
export async function seedWeaknessesFromConcepts(
  supabase: ServerClient,
  userId: string,
  concepts: KnowledgeItemRow[],
): Promise<void> {
  for (const concept of concepts) {
    if (concept.kind === "grammar" && concept.payload.description) {
      await upsertLearningWeakness(supabase, {
        userId,
        conceptId: concept.id,
        category: "grammar",
        description: concept.payload.description,
      });
    }

    if (concept.kind === "expression" && concept.payload.register) {
      await upsertLearningWeakness(supabase, {
        userId,
        conceptId: concept.id,
        category: "register",
        description: `Watch ${concept.payload.register} register for "${concept.label}"`,
      });
    }

    for (const mistake of concept.payload.commonMistakes ?? []) {
      await upsertLearningWeakness(supabase, {
        userId,
        conceptId: concept.id,
        category: weaknessCategoryForKind(concept.kind),
        description: mistake,
      });
    }
  }
}
