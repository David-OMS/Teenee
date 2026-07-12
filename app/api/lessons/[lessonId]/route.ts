import { NextResponse } from "next/server";

import { fetchParsedLesson } from "@/lib/lessons/fetch-parsed-lesson";
import { createServerClient } from "@/lib/supabase/create-server-client";

type RouteContext = {
  params: Promise<{ lessonId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { lessonId } = await context.params;
    const supabase = createServerClient();
    const lesson = await fetchParsedLesson(supabase, lessonId);
    return NextResponse.json(lesson);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load lesson.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
