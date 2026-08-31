import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["Courier Prime", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      colors: {
        paper: {
          50: "#FAF6EE",
          100: "#F1E9DC",
          200: "#E4D6C3",
          300: "#D6C4AD",
          400: "#B8A389",
          500: "#9C876E",
        },
        film: {
          base: "#1A1816",
          dark: "#121110",
          emulsion: "#23201C",
          edge: "#2E2A24",
          stamp: "#D97706",
          code: "#B88A52",
          red: "#8C493F",
          olive: "#6D7050",
        },
        ink: {
          900: "#1A1714",
          800: "#2B2621",
          700: "#423B33",
          600: "#5E554A",
          500: "#807466",
        },
      },
    },
  },
  plugins: [],
};
export default config;
