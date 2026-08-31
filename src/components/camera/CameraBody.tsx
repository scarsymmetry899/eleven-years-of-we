"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface CameraBodyProps {
  view: "front" | "rear";
  isPowered: boolean;
  children?: React.ReactNode;
  onPowerClick: () => void;
  onShutterClick: () => void;
  showFlash: boolean;
  shutterDepressed: boolean;
}

export default function CameraBody({
  view,
  isPowered,
  children,
  onPowerClick,
  onShutterClick,
  showFlash,
  shutterDepressed,
}: CameraBodyProps) {
  const [recoil, setRecoil] = useState(false);

  useEffect(() => {
    if (!shutterDepressed) {
      setRecoil(true);
      const timer = setTimeout(() => setRecoil(false), 80);
      return () => clearTimeout(timer);
    }
  }, [shutterDepressed]);

  return (
    <>
      {/* Flash Bloom Effect */}
      <AnimatePresence>
        {showFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 pointer-events-none bg-[#FFF8E7]/90 backdrop-blur-[2px]"
          />
        )}
      </AnimatePresence>

      <div
        style={{ perspective: "1200px" }}
        className="w-[96vw] max-w-[500px] sm:w-[88vw] md:w-[60vw] md:max-w-[680px] relative mx-auto select-none"
      >
        {/* Soft Physical Ambient Shadow on the Desk */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[88%] h-10 bg-[#2d2218]/30 rounded-[100%] filter blur-xl pointer-events-none" />

        <motion.div
          animate={{
            y: recoil ? 2 : 0,
            scale: isPowered && view === "front" ? 1.01 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="w-full h-full relative"
          style={{ aspectRatio: "1200/896" }}
        >
          {/* ================= FRONT VIEW ================= */}
          <motion.div
            initial={false}
            animate={{
              rotateY: view === "front" ? 0 : 180,
              opacity: view === "front" ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-10"
            style={{
              backfaceVisibility: "hidden",
              pointerEvents: view === "front" ? "auto" : "none",
            }}
          >
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={!isPowered ? onPowerClick : undefined}
            >
              {/* Front Camera with True Alpha Transparency */}
              <div className="relative w-full h-full drop-shadow-lg">
                <Image
                  src="/camera/front.png"
                  alt="2005 Compact Digital Camera Front"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Power Button Interactive Hotspot */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPowerClick();
                }}
                className="absolute top-[4%] left-[40%] w-[18%] h-[12%] cursor-pointer bg-transparent outline-none z-30 flex items-center justify-center"
                aria-label="Power Button"
              >
                {!isPowered && (
                  <span className="w-6 h-6 rounded-full border border-amber-500/80 animate-ping pointer-events-none" />
                )}

                {/* Amber Power LED */}
                <div
                  className={`absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] transition-opacity duration-300 ${
                    isPowered ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            </div>
          </motion.div>

          {/* ================= REAR VIEW (LCD & CONTROLS) ================= */}
          <motion.div
            initial={false}
            animate={{
              rotateY: view === "rear" ? 0 : -180,
              opacity: view === "rear" ? 1 : 0,
            }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-10"
            style={{
              backfaceVisibility: "hidden",
              pointerEvents: view === "rear" ? "auto" : "none",
            }}
          >
            <div className="relative w-full h-full">
              {/* Precise LCD Screen Container */}
              <div
                className="absolute overflow-hidden rounded-[2px] bg-[#0a0a0a] shadow-inner z-10"
                style={{
                  left: "32.5%",
                  top: "39.0%",
                  width: "28.7%",
                  height: "30.7%",
                }}
              >
                {children}
              </div>

              {/* Physical Camera Rear Body with Cut-out Glass Bezel Window */}
              <div className="relative w-full h-full z-20 pointer-events-none drop-shadow-lg">
                <Image
                  src="/camera/rear_window.png"
                  alt="2005 Compact Digital Camera Rear"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {/* Physical Shutter Hotspot */}
              <button
                onClick={onShutterClick}
                className="absolute top-[1%] right-[16%] w-[18%] h-[10%] cursor-pointer bg-transparent outline-none z-30"
                aria-label="Physical Shutter Button"
              />

              {/* Right Navigation / Shutter Trigger Overlay */}
              <button
                onClick={onShutterClick}
                className="absolute top-[42%] right-[12%] w-[20%] h-[24%] cursor-pointer bg-transparent outline-none z-30 rounded-full"
                aria-label="Capture Photo"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
