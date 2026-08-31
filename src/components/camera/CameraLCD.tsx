'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CameraLCDProps {
  isActive: boolean;
  isCaptured: boolean;
  isReview: boolean;
  photoCount: number;
  onLCDClick: () => void;
  focusOffset: { x: number; y: number };
}

export default function CameraLCD({
  isActive,
  isCaptured,
  isReview,
  photoCount,
  onLCDClick,
  focusOffset,
}: CameraLCDProps) {
  if (!isActive) {
    return (
      <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-20 pointer-events-none" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0.3 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={onLCDClick}
      className="relative w-full h-full bg-[#0a0a0a] overflow-hidden cursor-pointer select-none"
      style={{ animation: 'lcdFlicker 8s infinite' }}
    >
      {/* Viewfinder Preview Photo */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image 
          src="/photos/IMG-20150917-WA0002.jpg" 
          alt="First photo" 
          fill 
          className="object-cover"
          priority
        />
      </div>

      <div className="camera-lcd-scanline" />

      {/* Period-Authentic 2000s OSD Overlays */}
      <div className="absolute inset-0 z-10 p-1.5 sm:p-2 flex flex-col justify-between font-mono text-[7px] sm:text-[9px] leading-none pointer-events-none text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex gap-1.5 items-center">
            <span className="text-green-400 font-bold tracking-wider">AUTO</span>
            <span className={isCaptured ? "text-green-400 font-bold tracking-wider" : "text-red-400 font-bold tracking-wider animate-pulse"}>
              {isCaptured ? 'CAPTURED' : 'LIVE'}
            </span>
          </div>
          {/* 3-Bar Battery Icon */}
          <div className="flex gap-[1px] items-center p-[1px] border border-green-400 rounded-[1px]">
            <div className="w-[3px] h-[4px] bg-green-400" />
            <div className="w-[3px] h-[4px] bg-green-400" />
            <div className="w-[3px] h-[4px] bg-green-400" />
            <div className="w-[1.5px] h-[2.5px] bg-green-400 rounded-r-[0.5px] ml-[0.5px]" />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-end">
          {isReview ? (
            <div className="text-amber-400 font-bold tracking-wider">
              REVIEW • 001/{String(photoCount).padStart(3, '0')}
            </div>
          ) : (
            <div className="text-white font-bold tracking-wider">
              001 / {String(photoCount).padStart(3, '0')}
            </div>
          )}
          
          <div className="text-amber-400 font-bold tracking-wider" style={{ animation: 'timestampFlicker 4s infinite' }}>
            17.09.2015
          </div>
        </div>
      </div>

      {/* Center Focus Reticle */}
      {!isReview && (
        <motion.div 
          className="absolute inset-0 m-auto z-10 flex items-center justify-center pointer-events-none"
          animate={isCaptured ? { scale: 0.3 } : { scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{ x: focusOffset.x, y: focusOffset.y }}
        >
          {isCaptured ? (
            <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 relative" style={{ animation: 'focusBracketPulse 2s infinite' }}>
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/90" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/90" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/90" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/90" />
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
