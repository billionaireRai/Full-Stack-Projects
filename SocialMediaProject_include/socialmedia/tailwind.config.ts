// tailwind.config.ts
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'animate-heart-pop',
    'animate-bounce',
    'animate-spin-once',
    'animate-fade-in',
    'animate-scale-down',
    'animate-slide-up',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
