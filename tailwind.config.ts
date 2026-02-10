import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./tools/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: { DEFAULT: "#3b82f6", foreground: "#ffffff" },
        muted: { DEFAULT: "#2a2a2a", foreground: "#a1a1aa" },
        border: "#2a2a2a",
      },
      fontFamily: { sans: ["Inter", "system-ui", "sans-serif"], mono: ["JetBrains Mono", "ui-monospace", "monospace"] },
      borderRadius: { lg: "6px", md: "4px", sm: "2px" },
    },
  },
  plugins: [],
} satisfies Config;
