import { NextResponse } from "next/server";

import { buildExportPayload } from "@/lib/export/build-export-payload";
import { getDefaultUserId } from "@/lib/lessons/get-default-user-id";
import { createServerClient } from "@/lib/supabase/create-server-client";

export async function GET() {
  try {
    const supabase = createServerClient();
    const userId = await getDefaultUserId(supabase);
    const payload = await buildExportPayload(supabase, userId);

    return new NextResponse(JSON.stringify(payload, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="teenee-backup-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not export data.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
