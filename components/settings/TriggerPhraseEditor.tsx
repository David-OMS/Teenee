"use client";

import { FieldLabel } from "@/components/ui/FieldLabel";
import { TextField } from "@/components/ui/TextField";

type TriggerPhraseEditorProps = {
  phrases: string[];
  disabled?: boolean;
  onChange: (phrases: string[]) => void;
};

export function TriggerPhraseEditor({ phrases, disabled, onChange }: TriggerPhraseEditorProps) {
  function updatePhrase(index: number, value: string) {
    const next = [...phrases];
    next[index] = value;
    onChange(next);
  }

  function addPhrase() {
    onChange([...phrases, ""]);
  }

  function removePhrase(index: number) {
    onChange(phrases.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-3">
      <FieldLabel>Turn trigger phrases</FieldLabel>
      <p className="text-xs leading-relaxed text-muted-light">
        End-of-turn cues — e.g. &quot;Your turn.&quot;, &quot;Go ahead.&quot;
      </p>

      {phrases.map((phrase, index) => (
        <div key={`phrase-${index}`} className="flex items-center gap-2">
          <div className="flex-1">
            <TextField
              value={phrase}
              disabled={disabled}
              placeholder={`Phrase ${index + 1}`}
              onChange={(value) => updatePhrase(index, value)}
            />
          </div>
          <button
            type="button"
            disabled={disabled || phrases.length <= 1}
            onClick={() => removePhrase(index)}
            className="h-11 shrink-0 rounded-full px-3 text-xs font-medium text-muted-light disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        disabled={disabled || phrases.length >= 6}
        onClick={addPhrase}
        className="text-xs font-medium uppercase tracking-widest text-accent disabled:opacity-40"
      >
        Add phrase
      </button>
    </div>
  );
}
