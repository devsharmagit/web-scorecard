// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  future: {
    disableColorPaletteOKLCH: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
