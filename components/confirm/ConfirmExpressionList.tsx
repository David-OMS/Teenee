"use client";

import { ConfirmChip } from "@/components/confirm/ConfirmChip";
import type { ParsedExpressionItem } from "@/types/lesson/parsed-expression-item";

type ConfirmExpressionListProps = {
  items: ParsedExpressionItem[];
  onEdit: (id: string, french: string, english: string) => void;
};

export function ConfirmExpressionList({ items, onEdit }: ConfirmExpressionListProps) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-medium uppercase tracking-widest text-muted-light">
        Expressions
      </h2>
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
