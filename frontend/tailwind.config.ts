import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obs: {
          canvas: "#040810",
          surface1: "#09111e",
          surface2: "#0f1c30",
          surface3: "#162742",
          border: "#162338",
          borderHighlight: "#243652",
          focus: "#38bdf8",
        },
        nasa: {
          blue: "#0B3D91",
          red: "#FC3D21",
          dark: "#040810",
          card: "#09111e",
          border: "#162338",
          accent: "#38bdf8",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
