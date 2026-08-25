/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gryphon: {
          gold: "#F59E0B",
          amber: "#FBBF24",
          light: "#FEF08A",
          dark: "#D97706",
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        obsidian: {
          950: "#050507",
          900: "#0B0C10",
          850: "#0E1017",
          800: "#12141D",
          750: "#161924",
          700: "#1E2230",
        },
        cyan: {
          accent: "#06B6D4",
          glow: "#22D3EE",
        },
        emerald: {
          exec: "#10B981",
          glow: "#34D399",
        },
        violet: {
          token: "#8B5CF6",
          glow: "#A78BFA",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card-bg)",
          foreground: "var(--foreground)",
          border: "var(--card-border)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Geist Sans", "Outfit", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Fira Code", "monospace"],
        urdu: ["var(--font-urdu)", "Noto Nastaliq Urdu", "Gulzar", "serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 30px rgba(245, 158, 11, 0.25)",
        "gold-glow-lg": "0 0 50px rgba(245, 158, 11, 0.4)",
        "cyan-glow": "0 0 30px rgba(6, 182, 212, 0.25)",
        "emerald-glow": "0 0 30px rgba(16, 185, 129, 0.25)",
        "violet-glow": "0 0 30px rgba(139, 92, 246, 0.25)",
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.02)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "border-beam": {
          "100%": { "offset-distance": "100%" },
        },
      },
    },
  },
  plugins: [],
};
