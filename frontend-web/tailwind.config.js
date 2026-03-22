/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Editorial Luxury Palette
        gold: {
          50: '#fdfaf3',
          100: '#faf5e6',
          200: '#f5eacc',
          300: '#efd9a3',
          400: '#e8c470',
          500: '#d4af37',
          600: '#b8962e',
          700: '#967a25',
          800: '#6b5720',
          900: '#4a3c16',
        },
        bronze: {
          50: '#faf8f5',
          100: '#f5f0ea',
          200: '#e8ddd0',
          300: '#d4c4b0',
          400: '#b8a58a',
          500: '#9a8268',
          600: '#7d6854',
          700: '#635344',
          800: '#4a3f35',
          900: '#342d26',
        },
      },
      fontFamily: {
        display: ['Crimson Pro', 'Georgia', 'serif'],
        heading: ['Archivo', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'editorial': '0 30px 60px -15px rgba(0, 0, 0, 0.2)',
        'inner-luxury': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      letterSpacing: {
        'tighter': '-0.03em',
        'tight': '-0.01em',
      },
    },
  },
  plugins: [],
}
