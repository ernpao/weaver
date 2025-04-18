module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",  // This ensures Tailwind purges unused styles in production
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}