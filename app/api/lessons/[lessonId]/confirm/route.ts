import { NextResponse } from "next/server";

import { confirmLesson } from "@/lib/lessons/confirm-lesson";
import type { ConfirmedLessonContent } from "@/types/lesson/confirmed-lesson-content";

type RouteContext = {
  params: Promise<{ lessonId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { lessonId } = await context.params;
    const content = (await request.json()) as ConfirmedLessonContent;
    const result = await confirmLesson(lessonId, content);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Confirm failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
