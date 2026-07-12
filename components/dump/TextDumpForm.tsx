"use client";

import { useState } from "react";

import { DumpResultPreview } from "@/components/dump/DumpResultPreview";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextArea } from "@/components/ui/TextArea";
import { useTextDumpSubmit } from "@/hooks/use-text-dump-submit";

export function TextDumpForm() {
  const [text, setText] = useState("");
  const { submitState, result, submitError, submit, reset } = useTextDumpSubmit();

  const isSubmitting = submitState === "submitting";
  const isDone = submitState === "success";

  function handleSubmit() {
    void submit(text);
  }

  function handleReset() {
    setText("");
    reset();
  }

  if (isDone && result) {
    return (
      <DumpResultPreview
        message="Parsed and ready to confirm."
        lessonTitle={result.parsed?.title}
        lessonId={result.lessonId}
        content={result.textContent}
        onReset={handleReset}
        resetLabel="Write another"
      />
    );
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <TextArea
        value={text}
        onChange={setText}
        placeholder="Today we learned greetings — bonjour, bonsoir, formal vs informal…"
        disabled={isSubmitting}
        surface="dark"
      />

      {submitError ? <p className="text-sm text-accent">{submitError}</p> : null}

      <PrimaryButton
        onClick={handleSubmit}
        disabled={isSubmitting || text.trim().length === 0}
      >
        {isSubmitting ? "Saving…" : "Save class dump"}
      </PrimaryButton>
    </div>
  );
}
