"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PHOTOS } from "@/data/photos";

interface CameraToFilmTransitionProps {
  isActive: boolean;
  onTransitionComplete: () => void;
}

export function CameraToFilmTransition({
  isActive,
  onTransitionComplete,
}: CameraToFilmTransitionProps) {
  const [phase, setPhase] = useState<
    "idle" | "detaching" | "sprouting" | "darkening" | "complete"
  >("idle");

  const firstPhoto = PHOTOS[0];
  const photoCount = PHOTOS.length;

  useEffect(() => {
    if (!isActive) {
      setPhase("idle");
      return;
    }

    const t1 = setTimeout(() => setPhase("detaching"), 100);
    const t2 = setTimeout(() => setPhase("sprouting"), 700);
    const t3 = setTimeout(() => setPhase("darkening"), 1400);
    const t4 = setTimeout(() => {
      setPhase("complete");
      onTransitionComplete();
    }, 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isActive, onTransitionComplete]);

  if (!isActive && phase === "idle") return null;

  const sprocketCount = 6;

  return (
    <div className="relative flex flex-col items-center w-full">
      <motion.div
        className="relative mx-auto"
        initial={{ scale: 0.55, y: 0 }}
        animate={
          phase === "detaching"
            ? { scale: 0.7, y: 20 }
            : phase === "sprouting"
              ? { scale: 0.8, y: 40 }
              : phase === "darkening" || phase === "complete"
                ? { scale: 1, y: 0 }
                : { scale: 0.55, y: 0 }
        }
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: "min(90vw, 850px)" }}
      >
        <motion.div
          className="relative flex items-stretch overflow-hidden"
          initial={{
            backgroundColor: "#1a1a1a",
            borderRadius: "4px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
          animate={
            phase === "darkening" || phase === "complete"
              ? {
                  backgroundColor: "#161512",
                  borderRadius: "2px",
                  boxShadow:
                    "0 8px 24px rgba(35,28,20,0.16), 0 2px 6px rgba(0,0,0,0.08)",
                }
              : {
                  backgroundColor: "#1a1a1a",
                  borderRadius: "4px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* LEFT SPROCKET RAIL */}
          <motion.div
            className="bg-[#12110E] border-r border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0 overflow-hidden"
            initial={{ width: 0, opacity: 0 }}
            animate={
              phase === "sprouting" ||
              phase === "darkening" ||
              phase === "complete"
                ? { width: 56, opacity: 1 }
                : { width: 0, opacity: 0 }
            }
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="font-mono text-[9px] text-[#D97706] font-bold tracking-wider -rotate-90 origin-center whitespace-nowrap mb-2">
              EXP 01
            </div>

            <div className="flex flex-col justify-around items-center gap-4 my-2 flex-grow">
              {Array.from({ length: sprocketCount }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3.5 h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={
                    phase === "sprouting" ||
                    phase === "darkening" ||
                    phase === "complete"
                      ? { opacity: 0.8, scale: 1 }
                      : { opacity: 0, scale: 0.5 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            <div className="font-mono text-[8px] text-white/40 uppercase tracking-widest -rotate-90 origin-center whitespace-nowrap mt-2">
              ROLL 01
            </div>
          </motion.div>

          {/* CENTER PHOTO */}
          <div className="flex-grow flex flex-col justify-between bg-[#0F0E0C] p-2 sm:p-5 overflow-hidden relative">
            <motion.div
              className="flex items-center justify-between pb-2 text-[9px] font-mono uppercase tracking-wider select-none border-b border-white/5 mb-2"
              initial={{ opacity: 0 }}
              animate={
                phase === "darkening" || phase === "complete"
                  ? { opacity: 1 }
                  : { opacity: 0 }
              }
              transition={{ duration: 0.4 }}
            >
              <span className="text-[#D97706]/90 font-semibold">
                {firstPhoto.dateLabel || firstPhoto.year}
              </span>
              <span className="text-white/40">{firstPhoto.tag}</span>
            </motion.div>

            <div
              className="relative w-full mx-auto overflow-hidden rounded-[1px]"
              style={{
                aspectRatio: `${firstPhoto.aspectRatio || 1.33}`,
                maxHeight: "70vh",
              }}
            >
              <Image
                src={firstPhoto.src}
                alt={firstPhoto.caption}
                fill
                priority
                className="object-contain object-center filter contrast-[1.03]"
                sizes="(max-width: 1024px) 100vw, 850px"
              />

              <AnimatePresence>
                {(phase === "idle" || phase === "detaching") && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="camera-lcd-scanline" />
                    <div className="absolute top-2 left-2 font-mono text-[9px] text-green-400/80">
                      CAPTURED
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-0.5">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-[3px] h-[6px] bg-green-400/70 rounded-[0.5px]"
                        />
                      ))}
                    </div>
                    <div className="absolute bottom-2 left-2 font-mono text-[9px] text-white/70">
                      REVIEW • 001/{photoCount}
                    </div>
                    <div className="absolute bottom-2 right-2 font-mono text-[9px] text-[#D97706]/80">
                      17.09.2015
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Caption Bar */}
            <motion.div
              className="pt-3 border-t border-white/5 mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1"
              initial={{ opacity: 0, y: 8 }}
              animate={
                phase === "darkening" || phase === "complete"
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-0.5">
                <p className="font-serif text-base sm:text-xl text-[#F5EEE4] font-normal leading-snug">
                  Where it all began.
                </p>
                <p className="font-serif italic text-xs sm:text-sm text-[#D97706]/90">
                  September 2015. Just another day at work.
                </p>
              </div>
              <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider self-end sm:self-auto select-none">
                {firstPhoto.locationHint || firstPhoto.caption}
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              {phase === "sprouting" && (
                <motion.div
                  key="morphing-meta"
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] text-[#D97706]/80 tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  EXP 01 • ROLL 01 • 2015
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SPROCKET RAIL */}
          <motion.div
            className="bg-[#12110E] border-l border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0 overflow-hidden"
            initial={{ width: 0, opacity: 0 }}
            animate={
              phase === "sprouting" ||
              phase === "darkening" ||
              phase === "complete"
                ? { width: 56, opacity: 1 }
                : { width: 0, opacity: 0 }
            }
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="font-mono text-[9px] text-[#D97706] font-bold tracking-wider rotate-90 origin-center whitespace-nowrap mb-2">
              {firstPhoto.year}
            </div>

            <div className="flex flex-col justify-around items-center gap-4 my-2 flex-grow">
              {Array.from({ length: sprocketCount }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3.5 h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={
                    phase === "sprouting" ||
                    phase === "darkening" ||
                    phase === "complete"
                      ? { opacity: 0.8, scale: 1 }
                      : { opacity: 0, scale: 0.5 }
                  }
                  transition={{
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            <div className="font-mono text-[8px] text-white/40 uppercase tracking-widest rotate-90 origin-center whitespace-nowrap mt-2">
              SAFETY FILM
            </div>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {phase === "complete" && (
            <motion.p
              className="text-center font-serif italic text-sm sm:text-base text-[#8F5341] mt-6 select-none"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Turns out there were a few more.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
