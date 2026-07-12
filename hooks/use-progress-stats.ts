"use client";

import { useEffect, useState } from "react";

import type { ProgressStats } from "@/types/progress/progress-stats";

type UseProgressStatsResult = {
  stats: ProgressStats | null;
  isLoading: boolean;
  error: string | null;
};

export function useProgressStats(): UseProgressStatsResult {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/progress");
        const payload = (await response.json()) as ProgressStats & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Could not load progress.");
        }

        if (!cancelled) {
          setStats(payload);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Could not load progress.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { stats, isLoading, error };
}
