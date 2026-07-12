import { callJsonChatCompletion } from "@/lib/openai/call-json-chat-completion";
import {
  buildLessonParserPrompt,
  type LessonParserOutput,
} from "@/lib/lessons/parse-lesson/build-lesson-parser-prompt";
import { mapParserOutputToSummary } from "@/lib/lessons/parse-lesson/map-parser-output-to-summary";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

const SYSTEM_PROMPT =
  "You are a French lesson parser. Output valid JSON only. Extract only what the student said they learned.";

/** Parses raw dump text into a structured lesson summary via OpenAI. */
export async function parseLessonFromText(
  text: string,
  transcript?: string,
): Promise<ParsedLessonSummary> {
  const rawJson = await callJsonChatCompletion([
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildLessonParserPrompt(text) },
  ]);

  const output = JSON.parse(rawJson) as LessonParserOutput;
  return mapParserOutputToSummary(output, transcript);
}
