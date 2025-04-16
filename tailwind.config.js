/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#0052FF', // Base blue
          700: '#00359E', // Base dark blue
        },
      },
    },
  },
  plugins: [],
}; 