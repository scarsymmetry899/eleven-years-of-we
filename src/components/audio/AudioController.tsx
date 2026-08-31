"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

export function AudioController() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const chordIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generative nostalgic chord synthesizer using Web Audio API
  const initAudio = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Soft ambient noise generator (tape warmth / room tone)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.008; // extremely soft pink-ish noise
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, ctx.currentTime);

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      // Pentatonic warm piano/rhodes frequencies (D major / B minor: D3, F#3, A3, B3, D4, E4, F#4, A4)
      const frequencies = [146.83, 185.0, 220.0, 246.94, 293.66, 329.63, 369.99, 440.0];

      const playChordNote = (freq: number, delay: number, duration: number) => {
        if (!audioCtxRef.current || !gainNodeRef.current) return;
        const now = audioCtxRef.current.currentTime + delay;

        const osc = audioCtxRef.current.createOscillator();
        const noteGain = audioCtxRef.current.createGain();
        const noteFilter = audioCtxRef.current.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        noteFilter.type = "lowpass";
        noteFilter.frequency.setValueAtTime(600, now);
        noteFilter.frequency.exponentialRampToValueAtTime(200, now + duration);

        noteGain.gain.setValueAtTime(0.0001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.04, now + 0.8);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(gainNodeRef.current);

        osc.start(now);
        osc.stop(now + duration + 0.1);
      };

      // Play soft evolving arpeggios
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
          playChordNote(freq, idx * 0.9, 6.0);
        });
        patternIdx++;
      };

      step();
      chordIntervalRef.current = setInterval(step, 6500);

      // Fade master in smoothly
      masterGain.gain.exponentialRampToValueAtTime(0.45, ctx.currentTime + 2.5);
      setIsPlaying(true);
    } catch (e) {
      console.warn("Audio Context could not start:", e);
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
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.8);
        setTimeout(() => {
          audioCtxRef.current?.suspend();
          setIsPlaying(false);
        }, 850);
      }
    } else {
      audioCtxRef.current.resume();
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0.0001, audioCtxRef.current.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.45, audioCtxRef.current.currentTime + 1.2);
      }
      setIsPlaying(true);
    }
  };

  const handleEnterWithSound = () => {
    setHasPrompted(true);
    initAudio();
  };

  const handleContinueSilently = () => {
    setHasPrompted(true);
  };

  useEffect(() => {
    return () => {
      if (chordIntervalRef.current) clearInterval(chordIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  return (
    <>
      {/* Non-intrusive Audio Prompt on First Load */}
      {!hasPrompted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md px-6 animate-fadeIn">
          <div className="max-w-md w-full border border-[#d8cbb8]/20 bg-[#121110]/95 p-8 rounded-sm text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#d8cbb8]/10 text-[#d8cbb8] mb-6">
              <Sparkles className="w-5 h-5 text-amber-500/90 animate-pulse" />
            </div>
            
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#a89b88] mb-2">
              A 11-Year Friendship Story
            </p>
            <h2 className="font-serif text-3xl text-[#f2ece2] mb-4 tracking-wide font-normal">
              11 Years of WE
            </h2>
            <p className="text-sm text-[#c7bba8]/80 leading-relaxed mb-8 font-light">
              Designed as an authored documentary film. For the full emotional resonance, experience with sound enabled.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleEnterWithSound}
                className="px-6 py-3 bg-[#f2ece2] text-[#121110] font-sans text-xs font-semibold uppercase tracking-[0.18em] rounded-sm hover:bg-[#d8cbb8] transition-all shadow-lg hover:shadow-amber-900/20"
              >
                Experience with Sound
              </button>
              <button
                onClick={handleContinueSilently}
                className="px-6 py-3 border border-[#d8cbb8]/30 text-[#a89b88] font-sans text-xs uppercase tracking-[0.18em] rounded-sm hover:text-[#f2ece2] hover:border-[#d8cbb8]/60 transition-all"
              >
                Continue Silently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Subtle Persistent Audio Toggle */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <button
          onClick={toggleSound}
          title={isPlaying ? "Mute audio" : "Enable sound"}
          className="group flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 hover:border-amber-500/40 backdrop-blur-md text-[#c7bba8] hover:text-[#f2ece2] transition-all shadow-xl text-xs"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-amber-400/90 animate-pulse" />
              <span className="font-mono text-[10px] tracking-wider text-white/70 hidden sm:inline group-hover:inline">
                SOUND ON
              </span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-white/40" />
              <span className="font-mono text-[10px] tracking-wider text-white/40 hidden sm:inline group-hover:inline">
                SOUND OFF
              </span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
