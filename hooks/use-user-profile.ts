"use client";

import { useCallback, useEffect, useState } from "react";

import type { UserProfile } from "@/lib/profile/fetch-user-profile";

type ProfilePatch = {
  displayName?: string;
  profileSetupComplete?: boolean;
};

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/profile");
      const payload = (await response.json()) as UserProfile & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not load profile.");
      }

      setProfile(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(
    async (patch: ProfilePatch) => {
      setIsSaving(true);
      setError(null);

      try {
        const response = await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const payload = (await response.json()) as UserProfile & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Could not save profile.");
        }

        setProfile(payload);
        return payload;
      } catch (saveError) {
        setError(saveError instanceof Error ? saveError.message : "Could not save profile.");
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  return { profile, isLoading, isSaving, error, save, reload: load };
}
