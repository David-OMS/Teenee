const MIC_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: true,
};

let playbackContext: AudioContext | null = null;
let remoteAudioElement: HTMLAudioElement | null = null;

/**
 * Call synchronously inside a click/tap handler — starts mic request + unlocks audio
 * before any await (required on iOS Safari / PWA).
 */
export function prepareSessionMedia(): { micPromise: Promise<MediaStream> } {
  if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
    return {
      micPromise: Promise.reject(new Error("Microphone not available in this browser.")),
    };
  }

  if (!playbackContext || playbackContext.state === "closed") {
    playbackContext = new AudioContext();
  }
  void playbackContext.resume();

  if (!remoteAudioElement) {
    remoteAudioElement = new Audio();
  }

  remoteAudioElement.muted = true;
  void remoteAudioElement.play().catch(() => {
    // Best-effort unlock for Realtime remote audio.
  });
  remoteAudioElement.pause();
  remoteAudioElement.muted = false;
  remoteAudioElement.currentTime = 0;

  return {
    micPromise: navigator.mediaDevices.getUserMedia({ audio: MIC_CONSTRAINTS }),
  };
}

export function getRemoteAudioElement(): HTMLAudioElement {
  return remoteAudioElement ?? new Audio();
}

export function pickRecorderMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  if (MediaRecorder.isTypeSupported("audio/mp4")) {
    return "audio/mp4";
  }

  if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
    return "audio/webm;codecs=opus";
  }

  if (MediaRecorder.isTypeSupported("audio/webm")) {
    return "audio/webm";
  }

  return undefined;
}

export function extensionForMimeType(mimeType: string): string {
  if (mimeType.includes("mp4")) {
    return "m4a";
  }

  return "webm";
}

/** Play MP3 bytes via Web Audio — works after async fetch if prepareSessionMedia ran on tap. */
export async function playMp3Base64(base64: string): Promise<void> {
  if (!playbackContext || playbackContext.state === "closed") {
    throw new Error("Tap Start first to enable audio.");
  }

  if (playbackContext.state === "suspended") {
    await playbackContext.resume();
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  const audioBuffer = await playbackContext.decodeAudioData(bytes.buffer.slice(0));

  await new Promise<void>((resolve, reject) => {
    try {
      const source = playbackContext!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(playbackContext!.destination);
      source.onended = () => resolve();
      source.start(0);
    } catch (error) {
      reject(error instanceof Error ? error : new Error("Could not play Teenee's response."));
    }
  });
}

export function attachMicAnalyser(
  stream: MediaStream,
  onLevels: (levels: number[]) => void,
): () => void {
  if (!playbackContext || playbackContext.state === "closed") {
    playbackContext = new AudioContext();
  }

  const analyser = playbackContext.createAnalyser();
  analyser.fftSize = 64;
  analyser.smoothingTimeConstant = 0.8;

  const source = playbackContext.createMediaStreamSource(stream);
  source.connect(analyser);

  let frameId: number | null = null;
  const data = new Uint8Array(analyser.frequencyBinCount);

  const tick = () => {
    analyser.getByteFrequencyData(data);
    const levels = Array.from(data.slice(0, 5)).map((value) => value / 255);
    onLevels(levels.length > 0 ? levels : [0.1, 0.1, 0.1]);
    frameId = requestAnimationFrame(tick);
  };

  tick();

  return () => {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
    }
    source.disconnect();
    analyser.disconnect();
  };
}

export function closeSessionMedia(): void {
  void playbackContext?.close();
  playbackContext = null;
  if (remoteAudioElement) {
    remoteAudioElement.pause();
    remoteAudioElement.srcObject = null;
    remoteAudioElement = null;
  }
}
