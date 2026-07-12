"use client";

import { useCallback, useEffect, useState } from "react";

import type { LessonListItem } from "@/types/lesson/lesson-list-item";

type LessonListResponse = {
  lessons: LessonListItem[];
  error?: string;
};

export function useLessonList() {
  const [lessons, setLessons] = useState<LessonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lessons");
      const payload = (await response.json()) as LessonListResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not load lessons.");
      }
      setLessons(payload.lessons);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load lessons.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { lessons, isLoading, error, reload: load };
}
