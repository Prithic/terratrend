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
        nasa: {
          blue: "#0B3D91",
          red: "#FC3D21",
          dark: "#050b14",
          card: "#0d1829",
          border: "#1e293b",
          accent: "#38bdf8",
        },
      },
    },
  },
  plugins: [],
};
export default config;
