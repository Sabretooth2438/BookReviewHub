/** @type {import('tailwindcss').Config} */
import aspect from '@tailwindcss/aspect-ratio'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],

  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        primary: { DEFAULT: '#2563eb', dark: '#3b82f6' },
      },
    },
  },

  plugins: [aspect],
}
