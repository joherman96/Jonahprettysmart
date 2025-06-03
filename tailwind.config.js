/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff1ff',
          100: '#e1e4ff',
          200: '#c8ccff',
          300: '#a6a8ff',
          400: '#8382fe',
          500: '#6760f4',
          600: '#4F46E5', // Primary color
          700: '#4335c3',
          800: '#362c9e',
          900: '#2f2980',
          950: '#1e1656',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981', // Accent color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
      },
      spacing: {
        '18': '4.5rem',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: {
        'auth': '420px',
      },
    },
  },
  plugins: [],
};