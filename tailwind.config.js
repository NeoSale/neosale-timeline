/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './vendor/neosale-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#403CCF',
          dark: '#5B59E8',
        },
      },
      fontFamily: {
        sans: ['Poppins', '-apple-system', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
}
