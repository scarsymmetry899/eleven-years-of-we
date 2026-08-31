"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { PhotoMeta } from "@/data/photos";

interface ContinuousFilmStripProps {
  photos: PhotoMeta[];
  rollLabel?: string;
  yearLabel?: string;
  orientation?: "horizontal" | "vertical" | "panorama";
  className?: string;
  bleed?: boolean;
  priority?: boolean;
  onPhotoClick?: (photo: PhotoMeta) => void;
}

export function ContinuousFilmStrip({
  photos,
  rollLabel = "ROLL 01",
  yearLabel = "2015",
  orientation = "horizontal",
  className = "",
  bleed = false,
  priority = false,
  onPhotoClick,
}: ContinuousFilmStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // smooth drag speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (orientation === "vertical") {
    return (
      <div className={`film-reel-body rounded-[2px] p-2 sm:p-3 relative max-w-2xl mx-auto ${className}`}>
        <div className="flex flex-col gap-3">
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => onPhotoClick && onPhotoClick(photo)}
              className={`relative flex flex-col ${onPhotoClick ? "cursor-pointer group" : ""}`}
            >
              {/* Top Film Edge Metadata */}
              <div className="flex items-center justify-between px-2 py-0.5 text-[8px] font-mono text-white/40 uppercase tracking-widest select-none">
                <span className="text-[#D97706]">{photo.filmRoll || rollLabel}</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-1 bg-[#EFE6D8] rounded-[1px] opacity-70" />
                  <div className="w-2 h-1 bg-[#EFE6D8] rounded-[1px] opacity-70" />
                  <div className="w-2 h-1 bg-[#EFE6D8] rounded-[1px] opacity-70" />
                </div>
                <span>EXP {photo.frameNumber || `${idx + 1}A`}</span>
              </div>

              {/* Photo Frame Window */}
              <div
                className={`relative w-full overflow-hidden bg-[#121110] border border-white/5 ${
                  photo.orientation === "portrait"
                    ? "aspect-[3/4]"
                    : photo.orientation === "square"
                    ? "aspect-square"
                    : "aspect-[4/3] sm:aspect-[16/10]"
                }`}
              >
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  priority={priority && idx === 0}
                  className="object-cover object-center filter contrast-[1.03] transition-transform duration-500 group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                {photo.locationHint && (
                  <div className="absolute bottom-2 left-2 font-mono text-[8px] sm:text-[9px] text-white/80 bg-black/70 px-1.5 py-0.5 rounded tracking-wider uppercase">
                    {photo.locationHint}
                  </div>
                )}
              </div>

              {/* Bottom Frame Stamp */}
              <div className="flex items-center justify-between px-2 py-0.5 text-[7px] sm:text-[8px] font-mono text-white/30 uppercase tracking-widest select-none">
                <span>{photo.year || yearLabel}</span>
                <span className="text-[#D97706]/80">▲ SAFETY FILM</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal Multi-Frame Continuous Reel
  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`film-reel-body rounded-[2px] p-2 sm:p-3 relative select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      } ${
        bleed ? "w-screen -ml-[50vw] left-1/2 overflow-x-auto no-scrollbar" : "w-full overflow-x-auto no-scrollbar"
      } ${className}`}
      style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
    >
      <div className="flex flex-col min-w-max">
        {/* Continuous Top Sprocket Rail */}
        <div className="flex items-center justify-between px-3 py-1 border-b border-white/10 select-none">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[8px] sm:text-[9px] text-[#D97706] tracking-widest uppercase font-bold">
              {rollLabel}
            </span>
            <span className="font-mono text-[8px] text-white/40 tracking-wider">
              35mm SAFETY FILM
            </span>
          </div>
          {/* Continuous Sprocket Hole Array */}
          <div className="flex items-center gap-2.5 mx-4 overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="sprocket-hole opacity-80" />
            ))}
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] text-white/50 uppercase tracking-widest">
            {yearLabel}
          </span>
        </div>

        {/* Continuous Photo Strip Body */}
        <div className="flex items-stretch gap-2 sm:gap-3 py-2 sm:py-3 px-1">
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => onPhotoClick && onPhotoClick(photo)}
              className={`relative flex-shrink-0 bg-[#121110] border border-white/10 group ${
                onPhotoClick ? "hover:border-[#B47A3D]/70 transition-colors" : ""
              } ${
                photo.frameVariant === "panorama"
                  ? "w-[360px] sm:w-[540px] aspect-[16/9] sm:aspect-[21/9]"
                  : photo.orientation === "portrait"
                  ? "w-[220px] sm:w-[280px] aspect-[3/4]"
                  : photo.orientation === "square"
                  ? "w-[240px] sm:w-[300px] aspect-square"
                  : "w-[280px] sm:w-[380px] aspect-[4/3] sm:aspect-[16/10]"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.caption}
                fill
                priority={priority && idx === 0}
                className="object-cover object-center filter contrast-[1.03] transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Frame Stamp Overlay */}
              <div className="absolute top-2 left-2 font-mono text-[8px] sm:text-[9px] text-white/80 bg-black/70 px-1.5 py-0.5 rounded tracking-wider uppercase select-none">
                EXP {photo.frameNumber || `${idx + 1}`}
              </div>

              {photo.locationHint && (
                <div className="absolute bottom-2 left-2 font-mono text-[8px] sm:text-[9px] text-white/90 bg-black/70 px-1.5 py-0.5 rounded tracking-wider uppercase select-none">
                  {photo.locationHint}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Continuous Bottom Sprocket Rail */}
        <div className="flex items-center justify-between px-3 py-1 border-t border-white/10 select-none">
          <span className="font-mono text-[8px] text-white/40 uppercase tracking-widest">
            PROCESS C-41 / ARCHIVAL
          </span>
          <div className="flex items-center gap-2.5 mx-4 overflow-hidden">
            {Array.from({ length: 32 }).map((_, i) => (
              <div key={i} className="sprocket-hole opacity-80" />
            ))}
          </div>
          <span className="font-mono text-[8px] text-[#D97706] uppercase tracking-widest font-bold">
            ▲ EXPOSURE OK
          </span>
        </div>
      </div>
    </div>
  );
}
