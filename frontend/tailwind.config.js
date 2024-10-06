/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/chatroomui/*.{js,ts,jsx,tsx}",

  ],
  theme: {
    extend: {},
  },
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  plugins: [],
}