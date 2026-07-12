"use client";

import { ConfirmChip } from "@/components/confirm/ConfirmChip";
import type { ParsedVocabularyItem } from "@/types/lesson/parsed-vocabulary-item";

type ConfirmVocabListProps = {
  items: ParsedVocabularyItem[];
  onEdit: (id: string, french: string, english: string) => void;
};

export function ConfirmVocabList({ items, onEdit }: ConfirmVocabListProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-light">Vocabulary</h2>
      {items.map((item) => (
        <ConfirmChip
          key={item.id}
          label={item.french}
          sublabel={item.english}
          onSave={(french, english) => onEdit(item.id, french, english)}
        />
      ))}
    </section>
  );
}
