import { NextResponse } from "next/server";

import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { fetchProgressStats } from "@/lib/progress/fetch-progress-stats";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function GET() {
  try {
    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const stats = await fetchProgressStats(supabase, userId);

    return NextResponse.json(stats);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load progress.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
