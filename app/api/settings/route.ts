import { NextResponse } from "next/server";

import { fetchUserSettings } from "@/lib/settings/fetch-user-settings";
import { updateUserSettings } from "@/lib/settings/update-user-settings";
import type { AppSettingsPatch } from "@/lib/settings/app-settings";

export async function GET() {
  try {
    const settings = await fetchUserSettings();
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const patch = (await request.json()) as AppSettingsPatch;
    const settings = await updateUserSettings(patch);
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save settings.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
