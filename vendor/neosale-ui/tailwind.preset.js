/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#403CCF',
          dark: '#5B59E8',
          light: '#6e6bf0',
          50: '#f5f5ff',
          100: '#ededff',
          200: '#dddcff',
          300: '#c4c2ff',
          400: '#a8a5ff',
          500: '#403CCF',
          600: '#3632b0',
          700: '#2d2a9c',
          800: '#252280',
          900: '#1e1b68',
        },
        secondary: {
          DEFAULT: '#FBFAFF',
          dark: '#1a1a1a',
        },
        accent: {
          green: '#10b981',
          red: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'var(--font-geist-sans)', 'Arial', 'Helvetica', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(64, 60, 207, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(64, 60, 207, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
