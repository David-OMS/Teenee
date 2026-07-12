import { stopMediaStream } from "@/lib/audio/stop-media-stream";

export function createSessionUpdateEvent(instructions: string) {
  return {
    type: "session.update",
    session: {
      instructions,
    },
  };
}

export function attachRemoteAudio(pc: RTCPeerConnection, audioElement: HTMLAudioElement) {
  pc.ontrack = (event) => {
    audioElement.srcObject = event.streams[0] ?? null;
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
    audioElement.srcObject = null;
  }
}
