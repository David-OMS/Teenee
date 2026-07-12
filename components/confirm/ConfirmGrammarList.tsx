"use client";

import { ConfirmChip } from "@/components/confirm/ConfirmChip";
import type { ParsedGrammarItem } from "@/types/lesson/parsed-grammar-item";

type ConfirmGrammarListProps = {
  items: ParsedGrammarItem[];
  onEdit: (id: string, topic: string, description: string) => void;
};

export function ConfirmGrammarList({ items, onEdit }: ConfirmGrammarListProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-light">Grammar</h2>
      {items.map((item) => (
        <ConfirmChip
          key={item.id}
          label={item.topic}
          sublabel={item.description}
          onSave={(topic, description) => onEdit(item.id, topic, description)}
        />
      ))}
    </section>
  );
}
