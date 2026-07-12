"use client";

import { useCallback, useEffect, useState } from "react";

import type { AppSettings, AppSettingsPatch } from "@/lib/settings/app-settings";

export function useUserSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/settings");
      const payload = (await response.json()) as AppSettings & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to load settings.");
      }
      setSettings(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load settings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const save = useCallback(async (patch: AppSettingsPatch) => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const payload = (await response.json()) as AppSettings & { error?: string };
      if (!response.ok) {
        throw new Error(payload.error ?? "Failed to save settings.");
      }
      setSettings(payload);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }, []);

  return { settings, isLoading, isSaving, error, save, reload: load };
}
