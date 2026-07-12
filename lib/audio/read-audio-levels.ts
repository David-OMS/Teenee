const DEFAULT_BAR_COUNT = 24;

export function readAudioLevels(analyser: AnalyserNode, barCount = DEFAULT_BAR_COUNT) {
  const buffer = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buffer);

  const step = Math.floor(buffer.length / barCount);
  const levels: number[] = [];

  for (let index = 0; index < barCount; index += 1) {
    const value = buffer[index * step] ?? 0;
    levels.push(value / 255);
  }

  return levels;
}
