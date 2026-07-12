"use client";

import { useState } from "react";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { TextField } from "@/components/ui/TextField";

type ConfirmChipProps = {
  label: string;
  sublabel?: string;
  onSave: (label: string, sublabel: string) => void;
};

export function ConfirmChip({ label, sublabel = "", onSave }: ConfirmChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [primary, setPrimary] = useState(label);
  const [secondary, setSecondary] = useState(sublabel);

  if (isEditing) {
    return (
      <div className="space-y-3 rounded-xl bg-surface-light p-4">
        <TextField value={primary} onChange={setPrimary} surface="light" />
        <TextField value={secondary} onChange={setSecondary} surface="light" />
        <div className="flex gap-2">
          <div className="flex-1">
            <PrimaryButton
              onClick={() => {
                onSave(primary.trim(), secondary.trim());
                setIsEditing(false);
              }}
            >
              Save
            </PrimaryButton>
          </div>
          <div className="flex-1">
            <PrimaryButton variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </PrimaryButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-surface-light px-4 py-3">
      <div className="min-w-0 text-left">
        <p className="truncate text-sm font-medium">{label}</p>
        {sublabel ? <p className="truncate text-xs text-muted-light">{sublabel}</p> : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-accent" aria-label="Included">
          ✓
        </span>
        <button
          type="button"
          aria-label={`Edit ${label}`}
          onClick={() => {
            setPrimary(label);
            setSecondary(sublabel);
            setIsEditing(true);
          }}
          className="text-xs font-medium uppercase tracking-wide text-muted-light"
        >
          ✏️
        </button>
      </div>
    </div>
  );
}
