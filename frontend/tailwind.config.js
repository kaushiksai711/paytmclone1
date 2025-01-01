/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}", // Include all paths to files using Tailwind classes
    "./src/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8', // Example: primary blue
        secondary: '#9333EA', // Example: secondary purple
        accent: '#F59E0B', // Example: accent yellow
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom fonts
      },
      spacing: {
        128: '32rem',
        144: '36rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Adds better form styling
    require('@tailwindcss/typography'), // Adds prose styles
    require('@tailwindcss/aspect-ratio'), // Aspect ratios for responsive design
  ],
};

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

