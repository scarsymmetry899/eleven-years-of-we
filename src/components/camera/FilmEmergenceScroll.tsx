"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { PHOTOS, PhotoMeta } from "@/data/photos";
import { FilmInspectionModal } from "@/components/film/FilmInspectionModal";

interface FilmEmergenceScrollProps {
  onSelectPhoto?: (photo: PhotoMeta) => void;
}

export function FilmEmergenceScroll({ onSelectPhoto }: FilmEmergenceScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const emergencePhotos = PHOTOS.slice(0, 3);

  // Crisp, evocative notes
  const POETIC_NOTES: Record<string, { main: string; sub?: string }> = {
    "amazon-lobby-2015": {
      main: "Where it all began.",
      sub: "September 2015. Just another day at work.",
    },
    "amazon-cubicles-2015": {
      main: "Shifts, deadlines, and effortless conversations.",
      sub: "Between the work, we became us.",
    },
    "amazon-cafeteria-2016": {
      main: "Chai breaks that outlasted the shifts.",
    },
  };

  // Scroll animations
  const cameraSlotY = useTransform(scrollYProgress, [0.75, 1], [0, -120]);
  const cameraSlotOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]);

  const frame2Opacity = useTransform(scrollYProgress, [0.15, 0.35], [0.1, 1]);
  const frame2Clip = useTransform(
    scrollYProgress,
    [0.15, 0.4],
    ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]
  );

  const frame3Opacity = useTransform(scrollYProgress, [0.45, 0.7], [0.1, 1]);
  const frame3Clip = useTransform(
    scrollYProgress,
    [0.45, 0.75],
    ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"]
  );

  const promptOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full min-h-[220vh] flex flex-col items-center">
      {/* Sticky Camera Ejection Slot at top */}
      <motion.div
        style={{ y: cameraSlotY, opacity: cameraSlotOpacity }}
        className="sticky top-0 z-30 w-full flex flex-col items-center select-none pt-4 pointer-events-none"
      >
        <div className="w-72 sm:w-96 h-12 bg-[#1b1915] border-b-2 border-[#D97706]/80 rounded-b-md shadow-2xl flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b] animate-pulse" />
            <span className="font-mono text-[9px] text-[#D97706] uppercase tracking-widest font-semibold">
              FILM EJECT SLOT • 35mm
            </span>
          </div>
          <span className="font-mono text-[8px] text-white/40 tracking-wider">
            ROLL 01
          </span>
        </div>
        <div className="w-64 sm:w-88 h-1 bg-black/80 shadow-inner" />
      </motion.div>

      {/* Floating prompt */}
      <motion.div
        style={{ opacity: promptOpacity }}
        className="fixed bottom-10 z-20 pointer-events-none flex flex-col items-center gap-1.5 bg-[#161512]/90 border border-white/10 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-sm"
      >
        <span className="font-serif italic text-sm text-[#F5EEE4]">
          Scroll to pull memories from the camera
        </span>
        <span className="text-[#D97706] text-xs animate-bounce">↓</span>
      </motion.div>

      {/* Emerging Film Strip (Frames 1, 2, 3) */}
      <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4 flex flex-col items-center mt-2">
        <div className="w-full bg-[#161512] shadow-2xl rounded-[2px] border border-black/40 text-[#F5EEE4] flex flex-col relative overflow-hidden">
          
          {/* Frame 1: EXP 01 */}
          {(() => {
            const photo = emergencePhotos[0];
            const note = POETIC_NOTES[photo.id] || { main: photo.caption };
            return (
              <div
                key={photo.id}
                className="relative flex items-stretch border-b-2 border-[#262420] group"
              >
                <div className="w-9 sm:w-14 bg-[#12110E] border-r border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0">
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider -rotate-90 origin-center whitespace-nowrap mb-2">
                    EXP 01
                  </div>
                  <div className="flex flex-col justify-around items-center gap-3.5 sm:gap-4 my-2 flex-grow">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 sm:w-3.5 h-4 sm:h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner opacity-80"
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest -rotate-90 origin-center whitespace-nowrap mt-2">
                    {photo.filmRoll}
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-between bg-[#0F0E0C] p-2 sm:p-5 overflow-hidden">
                  <div className="flex items-center justify-between pb-2 text-[9px] font-mono text-white/40 uppercase tracking-wider select-none border-b border-white/5 mb-2">
                    <span className="text-[#D97706]/90 font-semibold">{photo.dateLabel || photo.year}</span>
                    <span>{photo.tag}</span>
                  </div>

                  <div
                    onClick={() => onSelectPhoto?.(photo)}
                    className="relative w-full mx-auto overflow-hidden rounded-[1px] cursor-pointer transition-transform duration-500 group-hover:scale-[1.006]"
                    style={{
                      aspectRatio: `${photo.aspectRatio || 1.33}`,
                      maxHeight: "84vh",
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      priority
                      className="object-contain object-center filter contrast-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 850px"
                    />
                    <div className="absolute top-2 right-2 font-mono text-[8px] text-white/80 bg-black/75 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity select-none hidden sm:block">
                      INSPECT ⊕
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="space-y-0.5">
                      <p className="font-serif text-base sm:text-xl text-[#F5EEE4] font-normal leading-snug">
                        {note.main}
                      </p>
                      {note.sub && (
                        <p className="font-serif italic text-xs sm:text-sm text-[#D97706]/90">
                          {note.sub}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider self-end sm:self-auto select-none">
                      {photo.locationHint || photo.caption}
                    </span>
                  </div>
                </div>

                <div className="w-9 sm:w-14 bg-[#12110E] border-l border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0">
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider rotate-90 origin-center whitespace-nowrap mb-2">
                    {photo.year}
                  </div>
                  <div className="flex flex-col justify-around items-center gap-3.5 sm:gap-4 my-2 flex-grow">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 sm:w-3.5 h-4 sm:h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner opacity-80"
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest rotate-90 origin-center whitespace-nowrap mt-2">
                    SAFETY FILM
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Frame 2: EXP 02 */}
          {(() => {
            const photo = emergencePhotos[1];
            if (!photo) return null;
            const note = POETIC_NOTES[photo.id] || { main: photo.caption };
            return (
              <motion.div
                key={photo.id}
                style={{ opacity: frame2Opacity, clipPath: frame2Clip }}
                className="relative flex items-stretch border-b-2 border-[#262420] group transition-opacity"
              >
                <div className="w-9 sm:w-14 bg-[#12110E] border-r border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0">
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider -rotate-90 origin-center whitespace-nowrap mb-2">
                    EXP 02
                  </div>
                  <div className="flex flex-col justify-around items-center gap-3.5 sm:gap-4 my-2 flex-grow">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 sm:w-3.5 h-4 sm:h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner opacity-80"
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest -rotate-90 origin-center whitespace-nowrap mt-2">
                    {photo.filmRoll}
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-between bg-[#0F0E0C] p-2 sm:p-5 overflow-hidden">
                  <div className="flex items-center justify-between pb-2 text-[9px] font-mono text-white/40 uppercase tracking-wider select-none border-b border-white/5 mb-2">
                    <span className="text-[#D97706]/90 font-semibold">{photo.dateLabel || photo.year}</span>
                    <span>{photo.tag}</span>
                  </div>

                  <div
                    onClick={() => onSelectPhoto?.(photo)}
                    className="relative w-full mx-auto overflow-hidden rounded-[1px] cursor-pointer transition-transform duration-500 group-hover:scale-[1.006]"
                    style={{
                      aspectRatio: `${photo.aspectRatio || 1.33}`,
                      maxHeight: "84vh",
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      className="object-contain object-center filter contrast-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 850px"
                    />
                    <div className="absolute top-2 right-2 font-mono text-[8px] text-white/80 bg-black/75 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity select-none hidden sm:block">
                      INSPECT ⊕
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="space-y-0.5">
                      <p className="font-serif text-base sm:text-xl text-[#F5EEE4] font-normal leading-snug">
                        {note.main}
                      </p>
                      {note.sub && (
                        <p className="font-serif italic text-xs sm:text-sm text-[#D97706]/90">
                          {note.sub}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider self-end sm:self-auto select-none">
                      {photo.locationHint || photo.caption}
                    </span>
                  </div>
                </div>

                <div className="w-9 sm:w-14 bg-[#12110E] border-l border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0">
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider rotate-90 origin-center whitespace-nowrap mb-2">
                    {photo.year}
                  </div>
                  <div className="flex flex-col justify-around items-center gap-3.5 sm:gap-4 my-2 flex-grow">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 sm:w-3.5 h-4 sm:h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner opacity-80"
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest rotate-90 origin-center whitespace-nowrap mt-2">
                    SAFETY FILM
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {/* Frame 3: EXP 03 */}
          {(() => {
            const photo = emergencePhotos[2];
            if (!photo) return null;
            const note = POETIC_NOTES[photo.id] || { main: photo.caption };
            return (
              <motion.div
                key={photo.id}
                style={{ opacity: frame3Opacity, clipPath: frame3Clip }}
                className="relative flex items-stretch border-b-2 border-[#262420] group transition-opacity"
              >
                <div className="w-9 sm:w-14 bg-[#12110E] border-r border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0">
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider -rotate-90 origin-center whitespace-nowrap mb-2">
                    EXP 03
                  </div>
                  <div className="flex flex-col justify-around items-center gap-3.5 sm:gap-4 my-2 flex-grow">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 sm:w-3.5 h-4 sm:h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner opacity-80"
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest -rotate-90 origin-center whitespace-nowrap mt-2">
                    {photo.filmRoll}
                  </div>
                </div>

                <div className="flex-grow flex flex-col justify-between bg-[#0F0E0C] p-2 sm:p-5 overflow-hidden">
                  <div className="flex items-center justify-between pb-2 text-[9px] font-mono text-white/40 uppercase tracking-wider select-none border-b border-white/5 mb-2">
                    <span className="text-[#D97706]/90 font-semibold">{photo.dateLabel || photo.year}</span>
                    <span>{photo.tag}</span>
                  </div>

                  <div
                    onClick={() => onSelectPhoto?.(photo)}
                    className="relative w-full mx-auto overflow-hidden rounded-[1px] cursor-pointer transition-transform duration-500 group-hover:scale-[1.006]"
                    style={{
                      aspectRatio: `${photo.aspectRatio || 1.33}`,
                      maxHeight: "84vh",
                    }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.caption}
                      fill
                      className="object-contain object-center filter contrast-[1.03]"
                      sizes="(max-width: 1024px) 100vw, 850px"
                    />
                    <div className="absolute top-2 right-2 font-mono text-[8px] text-white/80 bg-black/75 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity select-none hidden sm:block">
                      INSPECT ⊕
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="space-y-0.5">
                      <p className="font-serif text-base sm:text-xl text-[#F5EEE4] font-normal leading-snug">
                        {note.main}
                      </p>
                      {note.sub && (
                        <p className="font-serif italic text-xs sm:text-sm text-[#D97706]/90">
                          {note.sub}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-wider self-end sm:self-auto select-none">
                      {photo.locationHint || photo.caption}
                    </span>
                  </div>
                </div>

                <div className="w-9 sm:w-14 bg-[#12110E] border-l border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0">
                  <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider rotate-90 origin-center whitespace-nowrap mb-2">
                    {photo.year}
                  </div>
                  <div className="flex flex-col justify-around items-center gap-3.5 sm:gap-4 my-2 flex-grow">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 sm:w-3.5 h-4 sm:h-5 bg-[#EFE6D8] rounded-[1.5px] shadow-inner opacity-80"
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[7px] sm:text-[8px] text-white/40 uppercase tracking-widest rotate-90 origin-center whitespace-nowrap mt-2">
                    SAFETY FILM
                  </div>
                </div>
              </motion.div>
            );
          })()}

        </div>
      </div>
    </div>
  );
}
