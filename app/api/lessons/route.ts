import { NextResponse } from "next/server";

import { fetchLessonList } from "@/lib/lessons/fetch-lesson-list";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function GET() {
  try {
    const supabase = createServerClient();
    const lessons = await fetchLessonList(supabase);
    return NextResponse.json({ lessons });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load lessons.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
