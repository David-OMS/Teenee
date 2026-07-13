/** Unlock audio playback on mobile — call synchronously inside a click/tap handler. */
export function unlockAudioPlayback(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==",
    );
    audio.volume = 0.01;
    void audio.play().catch(() => {
      // Ignore — best-effort unlock.
    });
  } catch {
    // Ignore.
  }
}
