"use client";

import { useCallback, useEffect, useState } from "react";

import type { HomeSummary } from "@/types/home/home-summary";

export function useHomeSummary() {
  const [summary, setSummary] = useState<HomeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/home");
      const payload = (await response.json()) as HomeSummary & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not load home.");
      }

      setSummary(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load home.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { summary, isLoading, error, reload };
}
