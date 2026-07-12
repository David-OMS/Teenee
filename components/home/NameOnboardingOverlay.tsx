"use client";

import { useState } from "react";

import { TextField } from "@/components/ui/TextField";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type NameOnboardingOverlayProps = {
  onComplete: (name: string) => Promise<void>;
};

export function NameOnboardingOverlay({ onComplete }: NameOnboardingOverlayProps) {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Enter your name to continue.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onComplete(trimmed);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not save name.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-5 pb-28 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-canvas-light p-6 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Welcome</p>
        <h2 className="mt-2 font-display text-3xl uppercase tracking-tight">What should we call you?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-light">
          Your name appears on your profile home — nothing else changes yet.
        </p>

        <div className="mt-6">
          <TextField
            value={name}
            placeholder="Your name"
            disabled={isSaving}
            onChange={setName}
          />
        </div>

        {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}

        <div className="mt-6">
          <PrimaryButton disabled={isSaving} onClick={() => void handleSubmit()}>
            {isSaving ? "Saving…" : "Continue"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
