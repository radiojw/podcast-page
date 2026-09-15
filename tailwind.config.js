/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./types/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: "#f3efe8",
          parchment: "#efeae1",
          sand: "#e4dccb",
          gold: "#e2b84a",
          "gold-dark": "#b58e2a",
          "gold-light": "#f4e3b5",
          forest: "#143833",
          "forest-light": "#1d4f47",
          "forest-dark": "#0c2422",
          ink: "#12110f",
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