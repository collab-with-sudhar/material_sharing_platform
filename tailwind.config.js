/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FA76FF',
        'off-white': '#fcfbf8',
      },
      fontFamily: {
        sans: ['"Host Grotesk"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'spin-slow': 'spin 20s linear infinite',
        'scroll-left': 'scroll-left 40s linear infinite', // Adjusted speed for smoothness
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scroll-left': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}