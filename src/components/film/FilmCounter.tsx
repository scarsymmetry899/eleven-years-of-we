"use client";

import React, { useEffect, useState } from "react";

export function FilmCounter() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(window.scrollY / total);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalFrames = 23;
  const currentFrame = Math.min(
    totalFrames,
    Math.max(1, Math.floor(scrollProgress * totalFrames) + 1)
  );

  const years = [
    { threshold: 0.15, label: "2015 / AMAZON DAYS", roll: "ROLL 01" },
    { threshold: 0.35, label: "2016 / BECOMING US", roll: "ROLL 02" },
    { threshold: 0.50, label: "2016 / NIGHT STORIES", roll: "ROLL 04" },
    { threshold: 0.65, label: "2017–2020 / MILESTONES", roll: "ROLL 06" },
    { threshold: 0.85, label: "2024 / TRAVEL & HORIZONS", roll: "ROLL 08" },
    { threshold: 1.0, label: "2015–FOREVER / ELEVEN YEARS", roll: "ROLL 09" },
  ];

  const currentInfo = years.find((y) => scrollProgress <= y.threshold) || years[years.length - 1];

  return (
    <div className="fixed bottom-5 left-5 z-50 pointer-events-none select-none">
      <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded bg-[#1A1714]/90 border border-[#3A342D] text-[#F1E9DC] shadow-lg backdrop-blur-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse" />
        <span className="font-mono text-[10px] sm:text-xs tracking-wider text-[#D97706]">
          {currentInfo.roll}
        </span>
        <span className="text-white/30 text-xs">|</span>
        <span className="font-mono text-[10px] sm:text-xs tracking-widest text-[#E4D6C3]">
          EXP {String(currentFrame).padStart(2, "0")}/{totalFrames}
        </span>
        <span className="text-white/30 text-xs hidden sm:inline">|</span>
        <span className="font-sans text-[10px] uppercase tracking-wider text-white/60 hidden sm:inline">
          {currentInfo.label}
        </span>
      </div>
    </div>
  );
}
