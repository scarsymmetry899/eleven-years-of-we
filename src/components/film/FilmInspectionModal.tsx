"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { PhotoMeta } from "@/data/photos";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface FilmInspectionModalProps {
  photo: PhotoMeta | null;
  allPhotos: PhotoMeta[];
  onClose: () => void;
  onSelectPhoto: (photo: PhotoMeta) => void;
}

export function FilmInspectionModal({
  photo,
  allPhotos,
  onClose,
  onSelectPhoto,
}: FilmInspectionModalProps) {
  const currentIndex = photo ? allPhotos.findIndex((p) => p.id === photo.id) : -1;

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < allPhotos.length - 1) {
      onSelectPhoto(allPhotos[currentIndex + 1]);
    } else if (currentIndex === allPhotos.length - 1) {
      onSelectPhoto(allPhotos[0]);
    }
  }, [currentIndex, allPhotos, onSelectPhoto]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectPhoto(allPhotos[currentIndex - 1]);
    } else if (currentIndex === 0) {
      onSelectPhoto(allPhotos[allPhotos.length - 1]);
    }
  }, [currentIndex, allPhotos, onSelectPhoto]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!photo) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, onClose, handleNext, handlePrev]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Inspection of photo ${photo.caption}`}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-[#2D241B]/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Light Table Inspection Panel */}
      <div
        className="relative max-w-5xl w-full flex flex-col items-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between pb-3 text-white/70 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
            <span>LIGHT TABLE INSPECTION • NEGATIVE {photo.frameNumber}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-white/40 hidden sm:inline">
              EXP {currentIndex + 1} OF {allPhotos.length}
            </span>
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-[#F5EEE4] hover:text-[#D97706] bg-black/50 px-2.5 py-1 rounded border border-white/10 transition-colors cursor-pointer"
            >
              <span>CLOSE</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Illuminated Tracing Glass Mount */}
        <div className="relative w-full flex items-center justify-center py-2">
          {/* Subtle Light-Table Glow behind the negative */}
          <div className="absolute inset-4 bg-[#FAF6EE]/15 blur-2xl rounded-full pointer-events-none" />

          {/* Authentic 35mm Master Negative Frame */}
          <div className="relative film-reel-body p-3 sm:p-5 rounded-xs text-[#F5EEE4] shadow-2xl border border-white/15 max-w-4xl w-full">
            {/* Top Sprocket Rail */}
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 select-none mb-3">
              <span className="font-mono text-[9px] sm:text-[10px] text-[#D97706] tracking-widest font-bold">
                {photo.filmRoll} • 35mm SAFETY FILM
              </span>
              <div className="flex items-center gap-2.5 overflow-hidden max-w-sm">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="sprocket-hole opacity-80" />
                ))}
              </div>
              <span className="font-mono text-[9px] sm:text-[10px] text-white/60">
                {photo.year}
              </span>
            </div>

            {/* Exposed Photograph with Natural Aspect Ratio */}
            <div
              className={`relative w-full mx-auto overflow-hidden bg-[#121110] border border-white/10 ${
                photo.orientation === "portrait"
                  ? "aspect-[3/4] max-h-[68vh]"
                  : photo.orientation === "square"
                  ? "aspect-square max-h-[68vh]"
                  : "aspect-[4/3] sm:aspect-[16/10] max-h-[68vh]"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                priority
                className="object-contain object-center filter contrast-[1.03]"
                sizes="(max-width: 1024px) 100vw, 1000px"
              />
            </div>

            {/* Bottom Sprocket Rail */}
            <div className="flex items-center justify-between px-3 py-1.5 border-t border-white/10 select-none mt-3">
              <span className="font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest">
                PROCESS C-41 • 400TX
              </span>
              <div className="flex items-center gap-2.5 overflow-hidden max-w-sm">
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} className="sprocket-hole opacity-80" />
                ))}
              </div>
              <span className="font-mono text-[8px] sm:text-[9px] text-[#D97706] uppercase tracking-widest font-bold">
                ▲ EXP {photo.frameNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Caption & Navigation Controls */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-center sm:text-left">
          <div>
            <h4 className="font-serif text-lg sm:text-2xl text-[#F5EEE4] font-normal leading-tight">
              {photo.caption}
            </h4>
            {photo.subcaption && (
              <p className="font-sans text-xs text-[#E5D6C3]/80 mt-0.5">
                {photo.subcaption}
              </p>
            )}
          </div>

          {/* Understated Prev / Next Arrow Controls */}
          <div className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] uppercase tracking-wider">
            <button
              onClick={handlePrev}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-black/60 hover:bg-black/90 text-[#F5EEE4] border border-white/15 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>PREV</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-black/60 hover:bg-black/90 text-[#F5EEE4] border border-white/15 transition-colors cursor-pointer"
            >
              <span>NEXT</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
