import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glossyBlue: "#1E90FF",    // bright glossy blue
        glossyPurple: "#9B5DE5",  // vibrant purple
        glossyPink: "#F15BB5",    // neon pink
        glossyOrange: "#FF6F61",  // coral orange
        glossyTeal: "#00C9A7",    // aqua teal
        glossyYellow: "#FFD93D",  // sunny yellow
        glossyGreen: "#4ADE80",   // fresh green
        glossyRed: "#FF4D6D",     // poppy red
        glossyIndigo: "#5B21B6",  // deep indigo
        glossyCyan: "#06B6D4",    // clean cyan
      },
      backgroundImage: {
        glossyGradient1: "linear-gradient(135deg, #1E90FF 0%, #9B5DE5 100%)",
        glossyGradient2: "linear-gradient(135deg, #F15BB5 0%, #FF6F61 100%)",
        glossyGradient3: "linear-gradient(135deg, #00C9A7 0%, #FFD93D 100%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
