/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          25: '#FDFCF9',
          50: '#FAF8F5',
          100: '#F5F2EB',
          150: '#EFEBE2',
          200: '#E6E1D5',
          300: '#D5CEC0',
          400: '#B8AE9C',
          500: '#9C917E',
          600: '#7B715F',
          700: '#5C5446',
          800: '#3E382E',
          900: '#221E18',
        },
        command: {
          950: '#F7F5F0', // warm light beige canvas background
          900: '#FFFFFF', // clean warm white card surfaces
          850: '#FAF8F5', // subtle elevated surface
          800: '#E7E2D7', // warm sand border
          700: '#D6CEBE', // hover/active border
          600: '#8C8271',
          500: '#6E6454',
          400: '#4A4337',
          accent: '#B45309', // warm amber bronze accent
          terracotta: '#C2410C',
          sage: '#059669',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
};
