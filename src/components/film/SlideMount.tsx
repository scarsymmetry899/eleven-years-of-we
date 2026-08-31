"use client";

import React from "react";
import Image from "next/image";
import { PhotoMeta } from "@/data/photos";

interface SlideMountProps {
  photo: PhotoMeta;
  className?: string;
  rotation?: string;
  tagline?: string;
}

export function SlideMount({
  photo,
  className = "",
  rotation = "rotate-0",
  tagline,
}: SlideMountProps) {
  return (
    <div
      className={`slide-mount p-3 sm:p-5 rounded-xs transition-transform duration-500 hover:rotate-0 hover:shadow-xl ${rotation} ${className}`}
    >
      {/* Top Slide Mount Label */}
      <div className="flex items-center justify-between font-mono text-[9px] text-[#807466] uppercase tracking-widest pb-2 border-b border-[#E4D6C3] mb-3">
        <span>ARCHIVE SLIDE / {photo.year}</span>
        <span className="text-[#8C493F] font-semibold">{photo.frameNumber}</span>
      </div>

      {/* Slide Transparency Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#181614] border border-[#2B2621]/20">
        <Image
          src={photo.src}
          alt={photo.caption}
          fill
          className="object-cover object-center filter contrast-[1.04]"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>

      {/* Bottom Mount Footnote */}
      <div className="mt-3 pt-2 border-t border-[#E4D6C3] flex items-center justify-between">
        <div>
          <p className="font-serif text-sm sm:text-base text-[#1A1714] font-medium leading-tight">
            {photo.caption}
          </p>
          {tagline && (
            <p className="font-sans text-[11px] text-[#5E554A] uppercase tracking-wider mt-0.5">
              {tagline}
            </p>
          )}
        </div>
        <span className="font-mono text-[8px] text-[#B88A52] tracking-widest uppercase">
          PROCESS E-6
        </span>
      </div>
    </div>
  );
}
