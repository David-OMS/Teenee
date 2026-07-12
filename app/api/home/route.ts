import { NextResponse } from "next/server";

import { fetchHomeSummary } from "@/lib/home/fetch-home-summary";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function GET() {
  try {
    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const summary = await fetchHomeSummary(supabase, userId);

    return NextResponse.json(summary);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load home.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
