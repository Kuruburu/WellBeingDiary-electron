/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'pink-gradient': 'linear-gradient(135deg, rgba(242,219,242,1) 16%, rgba(228,168,203,1) 100%)',
      },
    },
  },
  plugins: [],
}