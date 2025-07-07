/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        gold: "#F2B442",
        bgDark: "#0a0a0a",
      },
    },
  },
  plugins: [],
  safelist: ['text-gold', 'bg-gold', 'font-orbitron'],
};
