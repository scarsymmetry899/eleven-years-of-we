# 🎞️ 11 Years of WE (2015 — Forever)

> *"WE MET AT WORK. WE STAYED FOR LIFE."*  
> **A continuous 35mm analog film reel and interactive 2000s camera experience celebrating 11 years of friendship between five best friends.**

[![Live Experience](https://img.shields.io/badge/Live%20Site-eleven--years--of--we.vercel.app-d97706?style=for-the-badge&logo=vercel)](https://eleven-years-of-we.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.18.2-f43f5e?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 Creative Philosophy

> **"DO NOT DESIGN A WEBSITE ABOUT MEMORIES. DESIGN THE MEMORY OBJECT ITSELF."**

This project is a bespoke digital artifact celebrating 11 years of friendship that began inside the Amazon office lobbies and cubicles in September 2015, continuing across weekend escapes, chaotic dinner tables, celebrations, weddings, travels, and the present day.

Instead of conventional slides, banners, or generic cards, the entire experience behaves like **one continuous physical 35mm film reel** that physically emerges from a **mid-2000s Kodak-style point-and-shoot digital camera**.

---

## ✨ Key Features & Architecture

### 1. 📷 The 2000s Camera Opening Ritual (Act I)
- **Photographic Point-and-Shoot Body**: Realistic champagne-silver camera resting on an ambient warm cream light-table surface (`#EFE6D8`).
- **3D Perspective Flip**: Turning on the camera automatically rotates the camera 180° in 3D perspective to reveal the rear LCD screen.
- **Period-Authentic LCD Viewfinder**: Displays the original 2015 Amazon lobby photo with authentic 2000s on-screen graphics (`AUTO`, `LIVE`, 3-bar battery, dynamic frame counter `001 / 23`, `17.09.2015` timestamp, and animated focus reticle with subtle pointer parallax).
- **Tactile Shutter & Metamorphosis**: Pressing the shutter fires a focus confirmation beep, ~80ms warm flash bloom, mechanical shutter sound, and camera body recoil.
- **Continuous Camera-to-Film Transformation**: The captured photo never fades out — its material morphs into physical `#161512` film stock with sprouting left/right vertical sprocket rails and analog metadata (`EXP 01 • ROLL 01 • 2015`).

### 2. 🎞️ Unified Endless 35mm Vertical Film Reel (Act II & III)
- **Continuous 35mm Film Strip**: Single unbroken vertical film reel containing all 23 curated exposures from 2015 to 2024.
- **Zero Photo Cropping**: Every image is displayed in its natural aspect ratio (`object-contain`) with authentic film margins.
- **Continuous Vertical Sprocket Rails**: Dual left and right vertical sprocket rails running along the entire height of the scroll.
- **Curated 5-Phase Narrative Order**:
  1. *Amazon Beginnings (2015–2016)*: Lobby, cubicles, cafeteria chai breaks, Sandia peak outing, couch moments.
  2. *ID Cards, Desks, Lifts & Chaos (2016–2018)*: Desk candids, elevator mirror selfies, house hangouts, night lanyards, workstation peace signs.
  3. *Drinks, Food & Prost Brewpub (2016)*: Friday feasts, low-light dinners, bistro booths, round table chaos, Prost Brewpub.
  4. *Weddings & Milestone Celebrations (2017–2020)*: Royal blue celebrations, wedding stages, grand 2020 wedding.
  5. *Trips, Travel & Recent Moments (2017–2024)*: Night lawn outings, amber rooftop terraces, lake road trips, mountain platform tea estates, and 2024 dinner portrait.
- **Light Table Inspection Modal**: Clicking any frame opens a high-resolution loupe inspection mode with keyboard navigation (← / → / Esc) and warm translucent light-table backdrop.

### 3. ➕ Interactive "Add Your Own Memory" Roll Extension
- Located at the end of the roll beneath `STILL SPACE FOR MORE.`
- Allows any friend to upload new photos directly from their phone or computer.
- Uploaded photos are **instantly developed into new 35mm film frames** (`EXP 24`, `EXP 25`, etc.) with matching sprocket rails and persist in `localStorage`.

### 4. 🎹 Generative Analog Audio Controller & Live Frame Counter
- Generative pentatonic Rhodes/piano chords + subtle tape room tone using native Web Audio API (zero external audio file dependencies).
- Real-time frame counter tracking roll chapters and live exposure index (`ROLL 01 | EXP 01/23 | 2015 / AMAZON DAYS`).

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | React framework for static generation, SSR, image optimization |
| **TypeScript** | Type-safe photo registry, metadata schema, and component interfaces |
| **Tailwind CSS** | Utility-first styling, light-table surface textures, responsive typography |
| **Framer Motion** | 3D camera flips, focus reticle animations, film development transitions |
| **Web Audio API** | Synthesized tactile sounds (power chirp, AF beep, shutter click, piano chords) |
| **Lucide React** | Minimalist icons for volume, inspect, and controls |
| **Vercel** | Edge deployment with automatic CI/CD |

---

## 📂 Project Structure

```
11-years-of-we/
├── public/
│   ├── camera/
│   │   ├── front.png         # Transparent front 2005 camera body
│   │   ├── rear.png          # Transparent rear camera body
│   │   └── rear_window.png   # Rear camera with cut-out LCD glass bezel
│   └── photos/               # 23 High-resolution curated historical photos (2015–2024)
│       ├── IMG-20150917-WA0002.jpg  # Amazon Lobby (Day 1)
│       ├── IMG_20151219_084749.jpg  # Cubicles & shift breaks
│       ├── ...
│       └── IMG-20241024-WA0075.jpg  # 2024 11-Year Dinner Portrait
├── src/
│   ├── app/
│   │   ├── globals.css       # Film stock tokens, sprocket gradients, scanline keyframes
│   │   ├── layout.tsx        # Root layout with fonts (Instrument Serif + Plus Jakarta)
│   │   └── page.tsx          # Main entry wrapper
│   ├── components/
│   │   ├── camera/
│   │   │   ├── CameraBody.tsx              # 3D flippable camera with interactive hotspots
│   │   │   ├── CameraLCD.tsx               # 2000s OSD viewfinder overlay
│   │   │   ├── CameraToFilmTransition.tsx  # Signature camera-to-film metamorphosis
│   │   │   └── MemoryCameraIntro.tsx       # 8-state orchestrator (idle ➔ film)
│   │   └── film/
│   │       ├── AnalogAudioController.tsx   # Generative background audio synthesizer
│   │       ├── EndlessVerticalFilmReel.tsx # Master 35mm film reel + user upload extension
│   │       ├── FilmCounter.tsx             # Live HUD roll & exposure counter
│   │       └── FilmInspectionModal.tsx     # Loupe light-table modal
│   └── data/
│       └── photos.ts         # Single source of truth for all 23 photos & metadata
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/scarsymmetry899/eleven-years-of-we.git

# Navigate into project directory
cd eleven-years-of-we

# Install dependencies
npm install

# Run local development server
npm run dev -p 3001
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

### Production Build
```bash
npm run build
npm start -p 3001
```

---

## 📜 Timeline of Exposures (2015 — 2024)

- **EXP 01**: *The Amazon Lobby* — September 17, 2015
- **EXP 02**: *Cubicle Shifts & Deadlines* — December 19, 2015
- **EXP 03**: *Cafeteria Chai Point* — January 13, 2016
- **EXP 04**: *Sandia Peak Outing* — February 9, 2016
- **EXP 05**: *Couch Memory* — May 7, 2016
- **EXP 06**: *Blue Lanyard Desk Candid* — May 19, 2016
- **EXP 07**: *Elevator Mirrors* — May 25, 2016
- **EXP 08**: *House Hangout* — June 3, 2016
- **EXP 09**: *Night Office Lanyard* — December 9, 2017
- **EXP 10**: *Cubicle Peace Signs* — February 2, 2018
- **EXP 11**: *Friday Table Feast* — June 3, 2016
- **EXP 12**: *Low-light Table Closeup* — July 2, 2016
- **EXP 13**: *Restaurant Booth* — July 2, 2016
- **EXP 14**: *Round Table Chaos* — August 7, 2016
- **EXP 15**: *Prost Brewpub* — December 5, 2016
- **EXP 16**: *Royal Blue Celebration* — October 10, 2017
- **EXP 17**: *Wedding Stage Front Row* — November 16, 2017
- **EXP 18**: *Grand Wedding Milestone* — December 9, 2020
- **EXP 19**: *Night Lawn Outing* — November 14, 2017
- **EXP 20**: *Amber Rooftop Terrace* — November 21, 2017
- **EXP 21**: *Lakeside Horizon Road Trip* — Recent
- **EXP 22**: *Mountain Platform Tea Estate* — Recent
- **EXP 23**: *11-Year Reunion Portrait* — October 24, 2024
- **FINALE**: *11 Years of US • 2015 — Forever*

---

## 📄 License

Created with ❤️ to celebrate 11 years of friendship (2015 — Forever).
