import { NextResponse } from "next/server";

import { parseLessonById } from "@/lib/lessons/parse-lesson-by-id";

type RouteContext = {
  params: Promise<{ lessonId: string }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { lessonId } = await context.params;
    const parsed = await parseLessonById(lessonId);
    return NextResponse.json({ lessonId, parsed });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Parse failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
