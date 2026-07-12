"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { ConfirmExpressionList } from "@/components/confirm/ConfirmExpressionList";
import { ConfirmGrammarList } from "@/components/confirm/ConfirmGrammarList";
import { ConfirmVocabList } from "@/components/confirm/ConfirmVocabList";
import { PageHeader } from "@/components/layout/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { buildConfirmedContent } from "@/lib/lessons/build-confirmed-content";
import type { ParsedLessonSummary } from "@/types/lesson/parsed-lesson-summary";

type LessonConfirmPanelProps = {
  lessonId: string;
};

/** Orchestrator — review and confirm parsed lesson before practice. */
export function LessonConfirmPanel({ lessonId }: LessonConfirmPanelProps) {
  const router = useRouter();
  const [parsed, setParsed] = useState<ParsedLessonSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/lessons/${lessonId}`);
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error ?? "Could not load lesson.");
        }
        setParsed(payload.parsed);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load lesson.");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, [lessonId]);

  const handleConfirm = useCallback(async () => {
    if (!parsed) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const content = buildConfirmedContent(parsed);
      const response = await fetch(`/api/lessons/${lessonId}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Could not confirm lesson.");
      }
      router.push("/explain");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not confirm lesson.");
    } finally {
      setIsSaving(false);
    }
  }, [lessonId, parsed, router]);

  if (isLoading) {
    return <p className="px-5 text-sm text-muted-light">Loading lesson…</p>;
  }

  if (!parsed) {
    return <p className="px-5 text-sm text-accent">{error ?? "Lesson unavailable."}</p>;
  }

  return (
    <div className="px-5 pb-24">
      <PageHeader title={parsed.title} subtitle="Confirm what Teenee extracted." display />
      <div className="space-y-6">
        <ConfirmVocabList
          items={parsed.vocabulary}
          onEdit={(id, french, english) =>
            setParsed({
              ...parsed,
              vocabulary: parsed.vocabulary.map((item) =>
                item.id === id ? { ...item, french, english } : item,
              ),
            })
          }
        />
        <ConfirmGrammarList
          items={parsed.grammar}
          onEdit={(id, topic, description) =>
            setParsed({
              ...parsed,
              grammar: parsed.grammar.map((item) =>
                item.id === id ? { ...item, topic, description } : item,
              ),
            })
          }
        />
        <ConfirmExpressionList
          items={parsed.expressions}
          onEdit={(id, french, english) =>
            setParsed({
              ...parsed,
              expressions: parsed.expressions.map((item) =>
                item.id === id ? { ...item, french, english } : item,
              ),
            })
          }
        />
      </div>
      {error ? <p className="mt-4 text-sm text-accent">{error}</p> : null}
      <div className="mt-8">
        <PrimaryButton onClick={() => void handleConfirm()} disabled={isSaving}>
          {isSaving ? "Confirming…" : "Confirm & practice"}
        </PrimaryButton>
      </div>
    </div>
  );
}
