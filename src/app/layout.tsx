import type { Metadata } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "11 Years of WE — Continuous Film Reel (2015 to Forever)",
  description: "An analog 35mm film reel celebrating 11 years of friendship.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${plusJakarta.variable}`}>
      <body className="bg-[#F1E9DC] text-[#1A1714] font-sans antialiased overflow-x-hidden selection:bg-[#D97706] selection:text-[#F1E9DC]">
        {/* Subtle Film Grain Overlay */}
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
