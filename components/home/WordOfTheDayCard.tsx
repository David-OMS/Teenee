import type { WordOfTheDay } from "@/types/home/word-of-the-day";

type WordOfTheDayCardProps = {
  word: WordOfTheDay;
};

export function WordOfTheDayCard({ word }: WordOfTheDayCardProps) {
  return (
    <section className="mx-5 mt-4 rounded-2xl bg-surface-light px-5 py-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-light">
        Word of the day
      </p>
      <p className="mt-3 font-display text-4xl tracking-tight">{word.french}</p>
      <p className="mt-2 text-sm text-muted-light">{word.english}</p>
      {word.example ? (
        <p className="mt-4 border-t border-border-light pt-4 text-sm italic leading-relaxed">
          {word.example}
        </p>
      ) : null}
    </section>
  );
}
