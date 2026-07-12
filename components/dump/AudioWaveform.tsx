type AudioWaveformProps = {
  levels: number[];
  isActive: boolean;
};

export function AudioWaveform({ levels, isActive }: AudioWaveformProps) {
  const bars = levels.length > 0 ? levels : Array.from({ length: 24 }, () => 0.08);

  return (
    <div
      aria-hidden
      className="flex h-16 w-full max-w-xs items-end justify-center gap-1 px-4"
    >
      {bars.map((level, index) => {
        const height = Math.max(8, Math.round(level * 64));
        const opacity = isActive ? 0.4 + level * 0.6 : 0.2;

        return (
          <span
            key={index}
            className="w-1 rounded-full bg-accent transition-[height,opacity] duration-75"
            style={{ height: `${height}px`, opacity }}
          />
        );
      })}
    </div>
  );
}
