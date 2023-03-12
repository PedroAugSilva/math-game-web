/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./src/**/*.tsx"],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
