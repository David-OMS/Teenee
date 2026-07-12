import { fetchUserSettings } from "@/lib/settings/fetch-user-settings";
import { createServerClient } from "@/lib/supabase/create-server-client";
import { querySingle } from "@/lib/supabase/query-single";
import type { CefrLevel } from "@/types/common/cefr-level";

export type UserProfile = {
  userId: string;
  displayName: string;
  profileSetupComplete: boolean;
  currentLevel: CefrLevel;
  targetLevel: CefrLevel;
};

type UserProfileRow = {
  id: string;
  display_name: string;
  profile_setup_complete: boolean;
  current_cefr_estimate: string;
  target_cefr: string;
};

export async function fetchUserProfile(): Promise<UserProfile> {
  const supabase = createServerClient();
  const settings = await fetchUserSettings();

  const row = await querySingle<UserProfileRow>(
    supabase
      .from("users")
      .select("id, display_name, profile_setup_complete, current_cefr_estimate, target_cefr")
      .eq("id", settings.userId)
      .single(),
    "Could not load profile",
  );

  return {
    userId: row.id,
    displayName: row.display_name,
    profileSetupComplete: row.profile_setup_complete,
    currentLevel: row.current_cefr_estimate as CefrLevel,
    targetLevel: row.target_cefr as CefrLevel,
  };
}

export type UserProfilePatch = {
  displayName?: string;
  profileSetupComplete?: boolean;
};

export async function updateUserProfile(patch: UserProfilePatch): Promise<UserProfile> {
  const current = await fetchUserProfile();
  const supabase = createServerClient();

  const displayName = patch.displayName?.trim() || current.displayName;

  const { error } = await supabase
    .from("users")
    .update({
      display_name: displayName,
      profile_setup_complete: patch.profileSetupComplete ?? current.profileSetupComplete,
      updated_at: new Date().toISOString(),
    })
    .eq("id", current.userId);

  if (error) {
    throw new Error(`Could not save profile: ${error.message}`);
  }

  return fetchUserProfile();
}
