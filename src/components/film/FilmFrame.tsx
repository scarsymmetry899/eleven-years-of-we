"use client";

import React from "react";
import Image from "next/image";
import { PhotoMeta } from "@/data/photos";

interface FilmFrameProps {
  photo: PhotoMeta;
  className?: string;
  showSprockets?: boolean;
  priority?: boolean;
  annotation?: string;
}

export function FilmFrame({
  photo,
  className = "",
  showSprockets = true,
  priority = false,
  annotation,
}: FilmFrameProps) {
  return (
    <div className={`relative flex flex-col film-strip-dark rounded-[2px] p-2 sm:p-3 text-[#F1E9DC] ${className}`}>
      {/* Top Sprocket & Film Edge Markings */}
      {showSprockets && (
        <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-white/10 select-none">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[#D97706] tracking-widest uppercase">
              {photo.filmRoll}
            </span>
            <span className="font-mono text-[8px] text-white/40 tracking-wider">
              EXP {photo.frameNumber}
            </span>
          </div>
          <div className="w-16 sm:w-28 h-2 sprockets-horizontal opacity-70" />
          <span className="font-mono text-[8px] text-white/50 uppercase tracking-widest">
            {photo.year}
          </span>
        </div>
      )}

      {/* Exposed Image Window */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-[#121110] border border-white/5">
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          priority={priority}
          className="object-cover object-center filter contrast-[1.03] transition-transform duration-700 hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Subtle On-Image Label */}
        {photo.locationHint && (
          <div className="absolute bottom-2 left-2 font-mono text-[9px] text-white/80 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs uppercase tracking-wider">
            {photo.locationHint}
          </div>
        )}
      </div>

      {/* Bottom Sprocket & Metadata Footnote */}
      {showSprockets && (
        <div className="flex items-center justify-between px-2 py-1 mt-1 border-t border-white/10 select-none">
          <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider truncate max-w-[120px]">
            {photo.tag}
          </span>
          <div className="w-16 sm:w-28 h-2 sprockets-horizontal opacity-70" />
          <span className="font-mono text-[8px] text-[#D97706] uppercase tracking-widest">
            ▲ SAFETY FILM
          </span>
        </div>
      )}

      {/* Optional Editorial Annotation */}
      {annotation && (
        <div className="mt-2 px-1 font-serif italic text-xs sm:text-sm text-[#D8CBB8] leading-snug">
          {annotation}
        </div>
      )}
    </div>
  );
}
