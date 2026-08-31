"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { PHOTOS, PhotoMeta } from "@/data/photos";
import { FilmInspectionModal } from "@/components/film/FilmInspectionModal";

export function EndlessVerticalFilmReel() {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoMeta | null>(null);
  const [userPhotos, setUserPhotos] = useState<PhotoMeta[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load any previously added user memories from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("11years_user_memories");
      if (saved) {
        setUserPhotos(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save user photos to localStorage
  const saveUserPhotos = (updated: PhotoMeta[]) => {
    setUserPhotos(updated);
    try {
      localStorage.setItem("11years_user_memories", JSON.stringify(updated));
    } catch {
      // Handle storage quota limit if large images
    }
  };

  // Handle uploading photos
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (!src) return;

        // Calculate aspect ratio
        const img = new window.Image();
        img.onload = () => {
          const aspectRatio = img.width && img.height ? img.width / img.height : 1.33;
          const currentCount = PHOTOS.length + userPhotos.length;
          const newPhoto: PhotoMeta = {
            id: `user-memory-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            filename: file.name,
            src: src,
            year: new Date().getFullYear().toString(),
            dateLabel: new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            era: "present",
            chapter: 5,
            width: img.width || 1200,
            height: img.height || 800,
            aspectRatio: aspectRatio,
            orientation: aspectRatio >= 1 ? "landscape" : "portrait",
            caption: "The story continues…",
            subcaption: "A new memory added to our roll.",
            locationHint: "Forever Chapter",
            filmRoll: "ROLL 01",
            frameNumber: String(currentCount + 1).padStart(2, "0"),
            frameVariant: "standard",
            tag: "New Memory",
          };

          const updated = [...userPhotos, newPhoto];
          saveUserPhotos(updated);
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove a user-added memory
  const handleRemovePhoto = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = userPhotos.filter((p) => p.id !== id);
    saveUserPhotos(updated);
    if (selectedPhoto?.id === id) {
      setSelectedPhoto(null);
    }
  };

  // Crisp, evocative captions for each of the 23 photos
  const POETIC_NOTES: Record<string, { main: string; sub?: string }> = {
    // 1. Amazon Beginnings
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
    "outing-sandia-peak-2016": {
      main: "First weekend escapes.",
      sub: "Young, carefree, and figuring it out together.",
    },
    "couch-moment-2016": {
      main: "Before we knew these days were memories.",
    },

    // 2. ID Cards, Desks, Lifts & Chaos
    "office-desk-candid-2016": {
      main: "Blue lanyards and easy smiles.",
    },
    "elevator-mirror-collage-2016": {
      main: "The spontaneous elevator mirrors.",
    },
    "house-hangout-2016": {
      main: "No plans, just crowding into the frame.",
    },
    "office-lanyard-night-2017": {
      main: "Different desks, same familiar people.",
    },
    "cubicle-peace-2018": {
      main: "Growing up together without even noticing.",
    },

    // 3. Drinks, Food & Prost Brewpub
    "dinner-table-feast-2016": {
      main: "Friday feasts that lasted until closing.",
    },
    "dinner-table-closeup-2016": {
      main: "Blurry photos, unforgettable nights.",
    },
    "restaurant-booth-2016": {
      main: "The nights that turned into inside jokes.",
    },
    "round-table-party-2016": {
      main: "Pure, unfiltered chaos and laughter.",
    },
    "prost-brewpub-2016": {
      main: "Prost nights & endless conversations.",
      sub: "A table we never wanted to leave.",
    },

    // 4. Weddings & Milestone Celebrations
    "royal-blue-celebration-2017": {
      main: "Dressed up for each other's milestones.",
    },
    "wedding-stage-2017": {
      main: "Showing up for every chapter of life.",
    },
    "grand-wedding-2020": {
      main: "Always front row for the big moments.",
    },

    // 5. Trips, Travel & Recent Moments
    "night-lawn-outing-2017": {
      main: "Late night walks and conversations about everything.",
    },
    "amber-terrace-2017": {
      main: "Golden hour, rooftops, and our people.",
    },
    "lake-car-horizon-recent": {
      main: "The road trips where the journey was the point.",
    },
    "mountain-platform-recent": {
      main: "Our world got bigger. Our circle stayed the same.",
    },
    "dinner-portrait-2024": {
      main: "Eleven years later. Exactly the same when we're together.",
      sub: "2015 to Forever.",
    },
  };

  const allDisplayPhotos = [...PHOTOS, ...userPhotos];

  return (
    <div className="relative w-full max-w-5xl mx-auto px-2 sm:px-4 pt-4 pb-16 flex flex-col items-center">
      {/* Hidden File Input for Adding Memories */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Top 35mm Film Leader Ejection Cap */}
      <div className="w-full flex flex-col items-center select-none mb-0">
        <div className="w-full bg-[#161512] rounded-t-md flex flex-col justify-center items-center py-3.5 px-6 border-t-4 border-[#D97706] shadow-xl border-x border-black/40">
          <div className="w-full flex items-center justify-between font-mono text-[9px] sm:text-[10px] text-[#D97706] uppercase tracking-widest font-bold">
            <span>35mm SAFETY FILM</span>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-4 bg-[#EFE6D8] rounded-[1px] opacity-80" />
              <div className="w-2.5 h-4 bg-[#EFE6D8] rounded-[1px] opacity-80" />
            </div>
            <span>ROLL 01 • 2015</span>
          </div>
          <span className="font-mono text-[8px] sm:text-[9px] text-white/40 tracking-[0.25em] uppercase mt-1">
            CONTINUOUS 35mm ARCHIVE • 11 YEARS OF US
          </span>
        </div>
      </div>

      {/* The ONE Continuous Master 35mm Film Strip Body (Zero gaps, all photos + user additions) */}
      <div className="w-full bg-[#161512] shadow-2xl rounded-b-md border-x border-b border-black/40 text-[#F5EEE4] flex flex-col relative overflow-hidden">
        
        {/* ALL 23 PHOTOGRAPHS + USER-ADDED EXTENSIONS */}
        {allDisplayPhotos.map((photo, index) => {
          const isUserAdded = index >= PHOTOS.length;
          const note = POETIC_NOTES[photo.id] || {
            main: photo.caption || "The story continues…",
            sub: photo.subcaption || "A new memory added to our roll.",
          };
          const isFirst = index === 0;
          const isMotifCallback = photo.id === "office-lanyard-night-2017";

          return (
            <div
              key={photo.id}
              className="relative flex items-stretch border-b-2 border-[#262420] group"
            >
              {/* LEFT VERTICAL SPROCKET RAIL */}
              <div className="w-9 sm:w-14 bg-[#12110E] border-r border-white/10 flex flex-col justify-between items-center py-4 select-none flex-shrink-0">
                <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider -rotate-90 origin-center whitespace-nowrap mb-2">
                  EXP {photo.frameNumber || `${String(index + 1).padStart(2, "0")}`}
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
                  {photo.filmRoll || "ROLL 01"}
                </div>
              </div>

              {/* CENTER EXPOSURE WINDOW */}
              <div className="flex-grow flex flex-col justify-between bg-[#0F0E0C] p-2 sm:p-5 overflow-hidden relative">
                {/* Top Frame Tag & Remove Option for User Photos */}
                <div className="flex items-center justify-between pb-2 text-[9px] font-mono text-white/40 uppercase tracking-wider select-none border-b border-white/5 mb-2">
                  <span className="text-[#D97706]/90 font-semibold">{photo.dateLabel || photo.year}</span>
                  <div className="flex items-center gap-2">
                    <span>{photo.tag || (isUserAdded ? "Added Memory" : "")}</span>
                    {isUserAdded && (
                      <button
                        onClick={(e) => handleRemovePhoto(photo.id, e)}
                        className="text-red-400/60 hover:text-red-400 cursor-pointer ml-1"
                        title="Remove this added memory"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* The Uncropped Image Window */}
                <div
                  onClick={() => setSelectedPhoto(photo)}
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
                    unoptimized={isUserAdded}
                    priority={isFirst}
                    className="object-contain object-center filter contrast-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 850px"
                  />

                  {isMotifCallback && (
                    <div
                      className="absolute bottom-3 right-3 font-mono text-[10px] text-amber-400 font-bold tracking-widest pointer-events-none drop-shadow-md select-none hidden sm:block"
                      style={{ animation: "timestampFlicker 6s infinite" }}
                    >
                      '17 12 09
                    </div>
                  )}

                  <div className="absolute top-2 right-2 font-mono text-[8px] text-white/80 bg-black/75 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity select-none hidden sm:block">
                    INSPECT ⊕
                  </div>
                </div>

                {/* Bottom Frame Caption Bar */}
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

              {/* RIGHT VERTICAL SPROCKET RAIL */}
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
        })}

        {/* ========================================================= */}
        {/* INTEGRATED MASTER FINALE & ADD YOUR OWN MEMORY EXTENSION */}
        {/* ========================================================= */}
        <div className="relative flex items-stretch border-t-2 border-[#262420] bg-[#12110E]">
          {/* LEFT SPROCKET RAIL FOR FINALE */}
          <div className="w-9 sm:w-14 bg-[#12110E] border-r border-white/10 flex flex-col justify-between items-center py-6 select-none flex-shrink-0">
            <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider -rotate-90 origin-center whitespace-nowrap mb-2">
              FINALE
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
              FOREVER
            </div>
          </div>

          {/* CENTER FINALE CONTENT & ADD MEMORY BUTTON */}
          <div className="flex-grow flex flex-col items-center justify-center bg-[#0F0E0C] p-6 sm:p-14 text-center space-y-6">
            <div className="w-full flex items-center justify-between font-mono text-[8px] sm:text-[9px] text-white/40 uppercase tracking-widest select-none pb-2 border-b border-white/5">
              <span>DEVELOPED EXPOSURES: {allDisplayPhotos.length}</span>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-3.5 bg-[#EFE6D8] rounded-[1px] opacity-70" />
                <div className="w-2 h-3.5 bg-[#EFE6D8] rounded-[1px] opacity-70" />
              </div>
              <span className="text-[#D97706] font-semibold">ROLL CONTINUES</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-6xl font-light text-[#F5EEE4] tracking-tight">
              11 YEARS OF US
            </h2>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 font-serif italic text-base sm:text-lg text-[#E5D6C3]/90">
              <span>From Amazon beginnings…</span>
              <span className="hidden sm:inline text-[#D97706]">➔</span>
              <span>to best friends…</span>
              <span className="hidden sm:inline text-[#D97706]">➔</span>
              <span className="text-white font-semibold not-italic">to family.</span>
            </div>

            <p className="font-serif text-xl sm:text-3xl text-[#D97706] font-normal tracking-wide">
              AND SOMEHOW, THE MAGIC CONTINUES.
            </p>

            <div className="pt-4 border-t border-white/10 w-full space-y-4">
              <p className="font-serif text-2xl sm:text-3xl text-[#F5EEE4] tracking-[0.2em]">
                2015 — FOREVER
              </p>
              <p className="font-mono text-[9px] sm:text-[10px] text-[#E5D6C3]/60 uppercase tracking-[0.25em]">
                The reel isn't ending. We're just caught up to now.
              </p>

              {/* Interactive Camera Action: Add Your Own Memory to the Reel */}
              <div className="pt-2 flex flex-col items-center gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer flex items-center gap-2.5 bg-[#1B1915] hover:bg-[#25221c] text-[#F5EEE4] border border-[#D97706]/60 hover:border-[#D97706] px-6 py-3 rounded-full shadow-xl transition-all group"
                  aria-label="Upload photo to add to the film reel"
                >
                  <svg
                    width="20"
                    height="17"
                    viewBox="0 0 24 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-[#D97706] group-hover:scale-110 transition-transform stroke-[1.8]"
                  >
                    <path d="M23 18C23 18.5304 22.7893 19.0391 22.4142 19.4142C22.0391 19.7893 21.5304 20 21 20H3C2.46957 20 1.96086 19.7893 1.58579 19.4142C1.21071 19.0391 1 18.5304 1 18V7C1 6.46957 1.21071 5.96086 1.58579 5.58579C1.96086 5.21071 2.46957 5 3 5H7L9 2H15L17 5H21C21.5304 5 22.0391 5.21071 22.4142 5.58579C22.7893 5.96086 23 6.46957 23 7V18Z" />
                    <circle cx="12" cy="12.5" r="4" />
                  </svg>
                  <span className="font-mono text-xs text-[#D97706] tracking-widest uppercase font-bold">
                    + ADD A NEW MEMORY TO THE REEL
                  </span>
                </button>

                <span className="font-mono text-[8px] sm:text-[9px] text-[#D97706]/80 tracking-[0.25em] uppercase">
                  Still space for more.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SPROCKET RAIL FOR FINALE */}
          <div className="w-9 sm:w-14 bg-[#12110E] border-l border-white/10 flex flex-col justify-between items-center py-6 select-none flex-shrink-0">
            <div className="font-mono text-[8px] sm:text-[9px] text-[#D97706] font-bold tracking-wider rotate-90 origin-center whitespace-nowrap mb-2">
              2015—∞
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

      </div>

      {/* Light Table Inspection Modal */}
      {selectedPhoto && (
        <FilmInspectionModal
          photo={selectedPhoto}
          allPhotos={allDisplayPhotos}
          onClose={() => setSelectedPhoto(null)}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />
      )}
    </div>
  );
}
