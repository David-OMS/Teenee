import { stopMediaStream } from "@/lib/audio/stop-media-stream";
import type { VoiceInputMode } from "@/types/conversation/voice-input-mode";

export function createBeatSystemMessageEvent(beatText: string) {
  return {
    type: "conversation.item.create",
    item: {
      type: "message",
      role: "system",
      content: [{ type: "input_text", text: beatText }],
    },
  };
}

export function createSessionUpdateEvent(
  instructions: string,
  options: { voiceInputMode?: VoiceInputMode; silenceTimeoutSeconds?: number } = {},
) {
  const session: Record<string, unknown> = {
    instructions,
    truncation: {
      type: "retention_ratio",
      retention_ratio: 0.8,
      token_limits: {
        post_instructions: 4096,
      },
    },
  };

  if (options.voiceInputMode === "push_to_talk") {
    session.audio = {
      input: {
        turn_detection: null,
      },
    };
  } else if (options.silenceTimeoutSeconds !== undefined) {
    session.audio = {
      input: {
        turn_detection: {
          type: "server_vad",
          silence_duration_ms: options.silenceTimeoutSeconds * 1000,
          prefix_padding_ms: 300,
          threshold: 0.5,
        },
      },
    };
  }

  return {
    type: "session.update",
    session,
  };
}

export function createCancelResponseEvent() {
  return { type: "response.cancel" };
}

export function createClearInputBufferEvent() {
  return { type: "input_audio_buffer.clear" };
}

export function createCommitInputBufferEvent() {
  return { type: "input_audio_buffer.commit" };
}

export function createResponseCreateEvent() {
  return { type: "response.create" };
}

export function attachRemoteAudio(pc: RTCPeerConnection, audioElement: HTMLAudioElement) {
  pc.ontrack = (event) => {
    const [stream] = event.streams;
    if (stream) {
      audioElement.srcObject = stream;
    }
  };
}

export function setMicrophoneEnabled(stream: MediaStream | null, enabled: boolean) {
  stream?.getAudioTracks().forEach((track) => {
    track.enabled = enabled;
  });
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
