import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1F2A44",
          50: "#F4F6FA",
          100: "#E5E9F2",
          200: "#C2CADD",
          300: "#9CA8C5",
          400: "#5C6B92",
          500: "#3A4A75",
          600: "#1F2A44",
          700: "#18213A",
          800: "#11182A",
          900: "#0A101C",
        },
        teal: {
          DEFAULT: "#0EA5A4",
          light: "#5EEAD4",
          dark: "#0F766E",
        },
        amber: {
          DEFAULT: "#F59E0B",
        },
        success: {
          DEFAULT: "#10B981",
        },
        danger: {
          DEFAULT: "#EF4444",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)",
        soft: "0 4px 16px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
