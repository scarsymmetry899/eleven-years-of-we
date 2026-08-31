"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";

export function AnalogAudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const chordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const initAudio = useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft room tone & subtle tape hiss
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.006;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      // Pentatonic warm piano/rhodes frequencies
      const playChordNote = (freq: number, delay: number, duration: number) => {
        if (!audioCtxRef.current || !gainNodeRef.current) return;
        const now = audioCtxRef.current.currentTime + delay;

        const osc = audioCtxRef.current.createOscillator();
        const noteGain = audioCtxRef.current.createGain();
        const noteFilter = audioCtxRef.current.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        noteFilter.type = "lowpass";
        noteFilter.frequency.setValueAtTime(550, now);
        noteFilter.frequency.exponentialRampToValueAtTime(180, now + duration);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.035, now + 0.7);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(gainNodeRef.current);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      };

      const chordPatterns = [
        [146.83, 220.0, 293.66, 369.99], // D maj9
        [185.0, 220.0, 293.66, 440.0],  // F# min7
        [220.0, 293.66, 369.99, 440.0], // A sus
        [246.94, 293.66, 369.99, 440.0], // B min7
      ];

      let patternIdx = 0;
      const step = () => {
        const chord = chordPatterns[patternIdx % chordPatterns.length];
        chord.forEach((freq, idx) => {
          playChordNote(freq, idx * 0.85, 6.0);
        });
        patternIdx++;
      };

      step();
      chordIntervalRef.current = setInterval(step, 6500);

      masterGain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 2.0);
      setIsPlaying(true);
    } catch (e) {
      console.warn("Audio context failed:", e);
    }
  }, []);

  const toggleSound = () => {
    if (!audioCtxRef.current) {
      initAudio();
      return;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
      setIsPlaying(true);
    } else if (isPlaying) {
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(
          gainNodeRef.current.gain.value,
          audioCtxRef.current.currentTime
        );
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.0001,
          audioCtxRef.current.currentTime + 0.8
        );
        setTimeout(() => {
          audioCtxRef.current?.suspend();
          setIsPlaying(false);
        }, 850);
      }
    } else {
      audioCtxRef.current.resume();
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0.0001, audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(
          0.4,
          audioCtxRef.current.currentTime + 1.0
        );
      }
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (chordIntervalRef.current) clearInterval(chordIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        onClick={toggleSound}
        className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#1A1714]/90 hover:bg-[#2B2621] border border-[#3A342D] text-[#E4D6C3] shadow-lg backdrop-blur-xs transition-colors group text-xs"
        title={isPlaying ? "Mute audio reel" : "Play ambient film score"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-[#D97706] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#D97706]">
              REEL AUDIO ON
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-white/50" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/50 group-hover:text-white/80">
              AUDIO OFF
            </span>
          </>
        )}
      </button>
    </div>
  );
}
