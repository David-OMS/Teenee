"use client";

import { useCallback, useState } from "react";

import type { CorrectionBudget } from "@/types/conversation/correction-budget";
import { DEFAULT_CORRECTION_BUDGET } from "@/types/conversation/correction-budget";
import type { TurnOutcome } from "@/lib/orchestrator/should-advance-node";
import type { SessionAgenda } from "@/types/session/session-agenda";
import type { SessionPhase } from "@/types/session/session-phase";
import type { TurnContextSlice } from "@/types/session/turn-context-slice";

type StartSessionResponse = {
  sessionId: string;
  lessonId: string;
  phase: SessionPhase;
  agenda: SessionAgenda;
  context: TurnContextSlice;
  lessonTitle: string;
  error?: string;
};

type TransitionResponse = StartSessionResponse;

type AdvanceSessionResponse = {
  context: TurnContextSlice;
  advanced: boolean;
  completed: boolean;
  error?: string;
};

export function useSessionFlow() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [phase, setPhase] = useState<SessionPhase | null>(null);
  const [context, setContext] = useState<TurnContextSlice | null>(null);
  const [correctionBudget, setCorrectionBudget] = useState<CorrectionBudget>({
    ...DEFAULT_CORRECTION_BUDGET,
  });
  const [turnsOnNode, setTurnsOnNode] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async (targetLessonId: string, targetPhase: SessionPhase) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: targetLessonId, phase: targetPhase }),
      });
      const payload = (await response.json()) as StartSessionResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not start session.");
      }

      setSessionId(payload.sessionId);
      setLessonId(payload.lessonId);
      setLessonTitle(payload.lessonTitle);
      setPhase(payload.phase);
      setContext(payload.context);
      setCorrectionBudget(payload.context.correctionBudget);
      setTurnsOnNode(1);
      return payload;
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : "Could not start session.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const transitionToPractice = useCallback(async (explainSessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/session/transition-to-practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ explainSessionId }),
      });
      const payload = (await response.json()) as TransitionResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not start practice.");
      }

      setSessionId(payload.sessionId);
      setLessonId(payload.lessonId);
      setLessonTitle(payload.lessonTitle);
      setPhase(payload.phase);
      setContext(payload.context);
      setCorrectionBudget(payload.context.correctionBudget);
      setTurnsOnNode(1);
      return payload;
    } catch (transitionError) {
      setError(
        transitionError instanceof Error ? transitionError.message : "Could not start practice.",
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hydrate = useCallback(async (targetSessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/session/${targetSessionId}`);
      const payload = (await response.json()) as StartSessionResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not load session.");
      }

      setSessionId(payload.sessionId);
      setLessonId(payload.lessonId);
      setLessonTitle(payload.lessonTitle);
      setPhase(payload.phase);
      setContext(payload.context);
      setCorrectionBudget(payload.context.correctionBudget);
      setTurnsOnNode(1);
      return payload;
    } catch (hydrateError) {
      setError(hydrateError instanceof Error ? hydrateError.message : "Could not load session.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const advance = useCallback(
    async (outcome: TurnOutcome = "success") => {
      if (!sessionId || !context) {
        return null;
      }

      try {
        const response = await fetch("/api/session/advance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId,
            currentItemId: context.currentItem.id,
            outcome,
            turnsOnNode,
            correctionBudget,
          }),
        });
        const payload = (await response.json()) as AdvanceSessionResponse;
        if (!response.ok) {
          throw new Error(payload.error ?? "Could not advance session.");
        }

        const previousItemId = context.currentItem.id;
        setContext(payload.context);
        setCorrectionBudget(payload.context.correctionBudget);
        setTurnsOnNode(
          payload.context.currentItem.id === previousItemId ? turnsOnNode + 1 : 1,
        );
        return payload;
      } catch (advanceError) {
        setError(advanceError instanceof Error ? advanceError.message : "Could not advance session.");
        return null;
      }
    },
    [sessionId, context, turnsOnNode, correctionBudget],
  );

  return {
    sessionId,
    lessonId,
    lessonTitle,
    phase,
    context,
    correctionBudget,
    turnsOnNode,
    isLoading,
    error,
    start,
    hydrate,
    transitionToPractice,
    advance,
  };
}
