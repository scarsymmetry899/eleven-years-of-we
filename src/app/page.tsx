"use client";

import React from "react";
import { MemoryCameraIntro } from "@/components/camera/MemoryCameraIntro";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#EFE6D8] text-[#211F1B] light-table-surface selection:bg-[#B47A3D] selection:text-[#F5EEE4]">
      {/* The 2000s Camera Opening Ritual ➔ Seamless Continuous 35mm Film Reel */}
      <MemoryCameraIntro />
    </main>
  );
}
