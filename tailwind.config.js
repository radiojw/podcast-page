/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#f8f6f2",
          parchment: "#f1ede6",
          sand: "#e8e2d6",
          gold: "#e9c46a",
          "gold-dark": "#b58e2a",
          "gold-light": "#f7e9c7",
          forest: "#193f3a",
          "forest-light": "#21524b",
          "forest-dark": "#0f2d29",
          ink: "#17130f",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        cover: "0 25px 50px -12px rgba(15, 45, 41, 0.35)",
        card: "0 4px 24px -4px rgba(23, 19, 15, 0.08)",
        "card-hover": "0 12px 40px -8px rgba(23, 19, 15, 0.14)",
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}