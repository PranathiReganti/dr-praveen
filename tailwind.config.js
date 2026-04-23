/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          50:  '#E6F4F2',
          100: '#B2DDD8',
          200: '#7DC5BE',
          300: '#4AAEA4',
          400: '#1F978A',
          500: '#0B7B6F',
          600: '#096358',
          700: '#074F46',
          800: '#053B34',
          900: '#032722',
        },
        navy: {
          50:  '#E8EDF4',
          100: '#C3CFDE',
          200: '#9AB0C8',
          300: '#6E91B3',
          400: '#4C789F',
          500: '#2D6090',
          600: '#1E4A7A',
          700: '#133663',
          800: '#0A1628',
          900: '#050E1A',
        },
        gold: '#C9A84C',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans:  ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}