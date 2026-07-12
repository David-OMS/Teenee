import { generateWordOfTheDay, normalizeFrench } from "@/lib/home/generate-word-of-the-day";
import type { ServerClient } from "@/lib/supabase/create-server-client";
import type { CefrLevel } from "@/types/common/cefr-level";
import type { WordOfTheDay } from "@/types/home/word-of-the-day";

type WordRow = {
  shown_on: string;
  french: string;
  english: string;
  example: string | null;
  created_at: string;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

async function fetchTodayWord(
  supabase: ServerClient,
  userId: string,
): Promise<WordOfTheDay | null> {
  const { data, error } = await supabase
    .from("word_of_the_day_history")
    .select("shown_on, french, english, example, created_at")
    .eq("user_id", userId)
    .eq("shown_on", todayKey())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const row = data as WordRow;
  return {
    french: row.french,
    english: row.english,
    example: row.example,
    shownOn: row.shown_on,
    generatedAt: row.created_at,
  };
}

async function fetchSeenFrenchWords(supabase: ServerClient, userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("word_of_the_day_history")
    .select("french")
    .eq("user_id", userId)
    .order("shown_on", { ascending: false })
    .limit(500);

  if (error || !data) {
    return [];
  }

  return (data as { french: string }[]).map((row) => row.french);
}

async function persistWord(
  supabase: ServerClient,
  userId: string,
  word: { french: string; english: string; example: string },
): Promise<WordOfTheDay> {
  const { data, error } = await supabase
    .from("word_of_the_day_history")
    .insert({
      user_id: userId,
      shown_on: todayKey(),
      french: word.french,
      english: word.english,
      example: word.example || null,
    })
    .select("shown_on, french, english, example, created_at")
    .single();

  if (error || !data) {
    throw new Error(`Could not save word of the day: ${error?.message ?? "unknown"}`);
  }

  const row = data as WordRow;
  return {
    french: row.french,
    english: row.english,
    example: row.example,
    shownOn: row.shown_on,
    generatedAt: row.created_at,
  };
}

/** Return today's word, generating and persisting a new one if needed. */
export async function getOrCreateWordOfTheDay(
  supabase: ServerClient,
  userId: string,
  level: CefrLevel,
): Promise<WordOfTheDay> {
  const existing = await fetchTodayWord(supabase, userId);
  if (existing) {
    return existing;
  }

  const seenWords = await fetchSeenFrenchWords(supabase, userId);
  const seenSet = new Set(seenWords.map(normalizeFrench));

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const generated = await generateWordOfTheDay(level, seenWords);
    if (seenSet.has(normalizeFrench(generated.french))) {
      seenWords.push(generated.french);
      continue;
    }

    return persistWord(supabase, userId, generated);
  }

  throw new Error("Could not generate a unique word of the day.");
}
