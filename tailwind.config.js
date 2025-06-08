// export default {
//     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//     theme: { extend: {} },
//     plugins: [],
//   };
//********************************* */

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Keep this if your index.html is directly in the root
    "./src/**/*.{js,ts,jsx,tsx}", // This ensures Tailwind scans all your React files
  ],
  theme: {
    extend: {
      // Custom animations
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' }, // Adjust bounce height
        },
        rotateHover: { // For the logo rotation on hover
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'fade-in-down': 'fadeInDown 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.6s ease-out forwards',
        'bounce-slow': 'bounceSlow 3s infinite ease-in-out', // Slow bounce
        'rotate-hover': 'rotateHover 0.8s linear infinite', // Applied conditionally
      }
    },
  },
  plugins: [],
};