"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { createAudioAnalyser } from "@/lib/audio/create-audio-analyser";
import { readAudioLevels } from "@/lib/audio/read-audio-levels";
import { stopMediaStream } from "@/lib/audio/stop-media-stream";
import { useRecordingTimer } from "@/hooks/use-recording-timer";

export type DumpRecordingState = "idle" | "recording" | "stopped";

export function useClassDumpRecorder() {
  const [state, setState] = useState<DumpRecordingState>("idle");
  const [levels, setLevels] = useState<number[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number | null>(null);

  const { seconds, reset: resetTimer } = useRecordingTimer(state === "recording");

  const stopVisualizer = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    stopVisualizer();
    recorderRef.current = null;
    analyserRef.current = null;
    void audioContextRef.current?.close();
    audioContextRef.current = null;
    stopMediaStream(streamRef.current);
    streamRef.current = null;
  }, [stopVisualizer]);

  useEffect(() => cleanup, [cleanup]);

  const startVisualizer = useCallback(
    (analyser: AnalyserNode) => {
      const tick = () => {
        setLevels(readAudioLevels(analyser));
        frameRef.current = requestAnimationFrame(tick);
      };
      tick();
    },
    [],
  );

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    resetTimer();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const { audioContext, analyser } = createAudioAnalyser(stream);
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      startVisualizer(analyser);

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopVisualizer();
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType }));
        setState("stopped");
      };

      recorder.start(250);
      setState("recording");
    } catch {
      cleanup();
      setError("Microphone access is required to record your class dump.");
      setState("idle");
    }
  }, [cleanup, resetTimer, startVisualizer, stopVisualizer]);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
    stopMediaStream(streamRef.current);
    streamRef.current = null;
  }, []);

  const resetRecording = useCallback(() => {
    cleanup();
    setState("idle");
    setLevels([]);
    setAudioBlob(null);
    setError(null);
    resetTimer();
  }, [cleanup, resetTimer]);

  return {
    state,
    seconds,
    levels,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    resetRecording,
  };
}
