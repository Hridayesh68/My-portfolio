/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#646cff', // Restoring custom colors from previous config
        secondary: '#535bf2',
        'white50': '#d9ecff',
        'black50': '#1c1c21',
        'black100': '#0e0e10',
        'black200': '#282732',
        'blue50': '#839cb5',
        'blue100': '#2d2d38',
      },
      fontFamily: {
        sans: ['"Mona Sans"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
};
