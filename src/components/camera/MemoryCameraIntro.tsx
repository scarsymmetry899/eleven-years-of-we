"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CameraBody from "./CameraBody";
import CameraLCD from "./CameraLCD";
import { CameraToFilmTransition } from "./CameraToFilmTransition";
import { EndlessVerticalFilmReel } from "@/components/film/EndlessVerticalFilmReel";
import { AnalogAudioController } from "@/components/film/AnalogAudioController";
import { FilmCounter } from "@/components/film/FilmCounter";
import { PHOTOS } from "@/data/photos";

export type CameraState =
  | "idle"
  | "powering"
  | "lcd"
  | "focusing"
  | "captured"
  | "review"
  | "developing"
  | "film";

export function MemoryCameraIntro() {
  const [state, setState] = useState<CameraState>("idle");
  const [showFlash, setShowFlash] = useState(false);
  const [shutterDepressed, setShutterDepressed] = useState(false);
  const [focusOffset, setFocusOffset] = useState({ x: 0, y: 0 });
  const [isSkipped, setIsSkipped] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio on user gesture
  const getAudioContext = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Tactile audio synthesizer
  const playSound = useCallback(
    (type: "power" | "beep" | "shutter") => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        if (type === "power") {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          osc1.type = "sine";
          osc2.type = "sine";
          osc1.frequency.setValueAtTime(1046.5, now);
          osc1.frequency.setValueAtTime(1318.5, now + 0.08);
          osc2.frequency.setValueAtTime(2093.0, now + 0.08);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now + 0.08);
          osc1.stop(now + 0.25);
          osc2.stop(now + 0.25);
        } else if (type === "beep") {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(1760, now);
          osc.frequency.setValueAtTime(0, now + 0.04);
          osc.frequency.setValueAtTime(1760, now + 0.07);

          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.16);
        } else if (type === "shutter") {
          const bufferSize = ctx.sampleRate * 0.1;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.015));
          }

          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1200, now);

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          noise.start(now);
        }
      } catch {
        // Fallback
      }
    },
    [getAudioContext]
  );

  // Focus reticle pointer offset
  const handlePointerMove = (e: React.PointerEvent) => {
    if (state !== "lcd") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = Math.max(-6, Math.min(6, (e.clientX - centerX) / 20));
    const dy = Math.max(-6, Math.min(6, (e.clientY - centerY) / 20));
    setFocusOffset({ x: dx, y: dy });
  };

  // 1. Power on trigger
  const handlePowerClick = () => {
    if (state !== "idle") return;
    playSound("power");
    setState("powering");

    setTimeout(() => {
      setState("lcd");
    }, 600);
  };

  // 2. Shutter trigger
  const handleShutter = () => {
    if (state !== "lcd") return;
    playSound("beep");
    setState("focusing");

    setTimeout(() => {
      playSound("shutter");
      setShutterDepressed(true);
      setShowFlash(true);
      setState("captured");

      setTimeout(() => {
        setShutterDepressed(false);
        setShowFlash(false);
      }, 120);

      // Review state
      setTimeout(() => {
        setState("review");
      }, 550);

      // Developing transformation
      setTimeout(() => {
        setState("developing");
      }, 1250);
    }, 280);
  };

  // 3. Developing transition complete
  const handleTransitionComplete = () => {
    setState("film");
  };

  // 4. Skip intro
  const handleSkipIntro = () => {
    setIsSkipped(true);
    setState("film");
  };

  const photoCount = PHOTOS.length;

  return (
    <div className="relative w-full">
      {/* ACT I: CAMERA SCENE (Full viewport fit, tight harmonious layout) */}
      {state !== "film" && state !== "developing" && (
        <div
          onPointerMove={handlePointerMove}
          className="h-[100dvh] max-h-[100dvh] flex flex-col justify-center items-center px-4 py-2 sm:py-6 relative select-none max-w-4xl mx-auto overflow-hidden"
        >
          {/* Top Bar with Skip Intro cleanly aligned */}
          <div className="w-full flex items-center justify-end px-2 mb-1 sm:mb-2">
            <button
              onClick={handleSkipIntro}
              className="font-mono text-[9px] sm:text-[10px] text-[#211F1B]/60 hover:text-[#211F1B] uppercase tracking-widest bg-white/70 hover:bg-white px-3 py-1 rounded-full border border-black/10 transition-all select-none shadow-xs cursor-pointer"
              aria-label="Skip camera intro to film reel"
            >
              Skip Intro →
            </button>
          </div>

          {/* Top Story Header */}
          <div className="text-center space-y-1 sm:space-y-1.5 max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#211F1B] font-normal tracking-tight leading-tight"
            >
              Every story starts somewhere.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif italic text-sm sm:text-lg md:text-xl text-[#8F5341]"
            >
              Ours started before we knew it was a story.
            </motion.p>
            <div className="pt-0.5">
              <span className="font-mono text-[9px] sm:text-[10px] md:text-xs tracking-[0.3em] text-[#B47A3D] uppercase font-semibold">
                2015 • {photoCount} EXPOSURES FOUND
              </span>
            </div>
          </div>

          {/* Interactive Camera Stage (Centered, Large & Impactful) */}
          <div className="relative flex flex-col items-center justify-center w-full my-2 sm:my-4">
            <CameraBody
              view={state === "lcd" || state === "focusing" || state === "captured" || state === "review" ? "rear" : "front"}
              isPowered={state !== "idle"}
              onPowerClick={handlePowerClick}
              onShutterClick={handleShutter}
              showFlash={showFlash}
              shutterDepressed={shutterDepressed}
            >
              <CameraLCD
                isActive={state === "lcd" || state === "focusing" || state === "captured" || state === "review"}
                isCaptured={state === "captured"}
                isReview={state === "review"}
                photoCount={photoCount}
                onLCDClick={handleShutter}
                focusOffset={focusOffset}
              />
            </CameraBody>
          </div>

          {/* Bottom Interactive Controls (Cohesive Spacing & Animated Glow) */}
          <div className="w-full flex flex-col items-center justify-center min-h-[60px] z-20">
            {state === "idle" && (
              <motion.button
                onClick={handlePowerClick}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    "0 4px 14px rgba(0,0,0,0.2)",
                    "0 8px 25px rgba(217, 119, 6, 0.45)",
                    "0 4px 14px rgba(0,0,0,0.2)",
                  ],
                }}
                transition={{
                  scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                  boxShadow: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.96 }}
                className="cursor-pointer flex items-center gap-2.5 bg-[#1B1915] text-[#F5EEE4] px-8 py-3.5 sm:px-9 sm:py-4 rounded-full border border-amber-500/70 hover:border-amber-400 transition-all"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span className="font-mono text-xs sm:text-sm tracking-widest uppercase font-bold text-amber-300">
                  Power on Camera
                </span>
                <span className="text-amber-400 text-base">➔</span>
              </motion.button>
            )}

            {state === "powering" && (
              <div className="flex items-center gap-2 text-[#D97706] font-mono text-xs sm:text-sm tracking-wider animate-pulse">
                <div className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                <span>Turning on & looking through viewfinder…</span>
              </div>
            )}

            {state === "lcd" && (
              <motion.button
                onClick={handleShutter}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 4px 14px rgba(0,0,0,0.2)",
                    "0 8px 28px rgba(217, 119, 6, 0.55)",
                    "0 4px 14px rgba(0,0,0,0.2)",
                  ],
                }}
                transition={{
                  scale: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                  boxShadow: { repeat: Infinity, duration: 1.8, ease: "easeInOut" },
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer flex items-center gap-3 bg-[#D97706] hover:bg-[#B45309] text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-full shadow-2xl transition-all"
              >
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                  Take the first photo
                </span>
                <span className="font-mono text-[10px] sm:text-xs opacity-90 tracking-wider">
                  (PRESS SHUTTER)
                </span>
              </motion.button>
            )}

            {state === "focusing" && (
              <div className="flex items-center gap-2 text-green-600 font-mono text-xs sm:text-sm tracking-wider font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping" />
                <span>AUTOFOCUS LOCKED</span>
              </div>
            )}

            {state === "captured" && (
              <div className="flex items-center gap-2 text-[#211F1B] font-mono text-xs sm:text-sm tracking-widest font-bold uppercase">
                <span>⚡ CAPTURED</span>
              </div>
            )}

            {state === "review" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="font-serif text-2xl sm:text-3xl text-[#D97706] font-semibold">
                  Got it.
                </p>
                <p className="font-mono text-[9px] sm:text-[10px] text-[#211F1B]/60 tracking-widest uppercase mt-0.5">
                  Developing memory into 35mm film…
                </p>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* ACT I ➔ ACT II METAMORPHOSIS: CameraToFilmTransition */}
      {state === "developing" && (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 relative">
          <CameraToFilmTransition
            isActive={true}
            onTransitionComplete={handleTransitionComplete}
          />
        </div>
      )}

      {/* ACT II & III: THE CONTINUOUS 35MM MASTER REEL + AUDIO CONTROLS + FRAME COUNTER */}
      {state === "film" && (
        <motion.div
          initial={{ opacity: isSkipped ? 0 : 1 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <AnalogAudioController />
          <FilmCounter />
          <EndlessVerticalFilmReel />
        </motion.div>
      )}
    </div>
  );
}
