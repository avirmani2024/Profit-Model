/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        electricPurple: '#a855ff',
        deepMidnight: '#0d0b1f',
        softSlate: '#1d1a2e',
        iceWhite: '#f5f6ff',
        limeAccent: '#b0ff67',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 