/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        girarmoneda: {
          '0%': { 
            transform: 'rotateY(0deg) rotateX(0deg)' 
          },
          '25%': { 
            transform: 'rotateY(90deg) rotateX(15deg)' 
          },
          '50%': { 
            transform: 'rotateY(180deg) rotateX(30deg)' 
          },
          '75%': { 
            transform: 'rotateY(270deg) rotateX(15deg)' 
          },
          '100%': { 
            transform: 'rotateY(360deg) rotateX(0deg)' 
          },
        },
      },
      animation: {
        girarmoneda: 'girarmoneda .8s ease-in-out 2',
      },
      perspective: {
        1000: '1000px', // profundidad para 3D
      },
      backfaceVisibility: {
        hidden: 'hidden',
      },
      
    },
  },
  plugins: [],
}