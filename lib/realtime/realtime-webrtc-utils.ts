import { stopMediaStream } from "@/lib/audio/stop-media-stream";

export function createSessionUpdateEvent(instructions: string) {
  return {
    type: "session.update",
    session: {
      instructions,
    },
  };
}

export function createCancelResponseEvent() {
  return { type: "response.cancel" };
}

export function attachRemoteAudio(pc: RTCPeerConnection, audioElement: HTMLAudioElement) {
  pc.ontrack = (event) => {
    const [stream] = event.streams;
    if (stream) {
      audioElement.srcObject = stream;
    }
  };
}

export function cleanupPeerConnection(
  pc: RTCPeerConnection | null,
  stream: MediaStream | null,
  audioElement: HTMLAudioElement | null,
) {
  stopMediaStream(stream);
  pc?.close();
  if (audioElement) {
    audioElement.pause();
    audioElement.srcObject = null;
  }
}
