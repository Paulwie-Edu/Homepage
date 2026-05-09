import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#060913",
        foreground: "#E6EAF2"
      },
      boxShadow: {
        glow: "0 0 120px rgba(95, 85, 255, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
