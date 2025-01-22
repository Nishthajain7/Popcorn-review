import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        slidein: "transform 0.3s ease-in-out;",
        slideout: "transform 0.3s ease-in-out;",
      },
      keyframes: {
        slidein: {
          "0%": {
            width: "0rem",
          },
          "100%": {
            opacity: "15rem",
          },
        },
        slideout: {
          "0%": {
            width: "15rem",
          },
          "100%": {
            width: "0rem",
          },
        },
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
