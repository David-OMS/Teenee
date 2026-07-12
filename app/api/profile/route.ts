import { NextResponse } from "next/server";

import {
  fetchUserProfile,
  updateUserProfile,
  type UserProfilePatch,
} from "@/lib/profile/fetch-user-profile";

export async function GET() {
  try {
    const profile = await fetchUserProfile();
    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const patch = (await request.json()) as UserProfilePatch;

    if (patch.displayName !== undefined && patch.displayName.trim().length === 0) {
      return NextResponse.json({ error: "Name cannot be empty." }, { status: 400 });
    }

    const profile = await updateUserProfile(patch);
    return NextResponse.json(profile);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not save profile.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
