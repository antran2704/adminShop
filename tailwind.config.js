/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#418efd",
        text: "#1E1E1E",
        desc: "#333333",
        success: "#10b981",
        warn: "#ffb702",
        error: "#ff623d",
        pending: "#ffb702",
        cancle: "#ff623d",
        darkInput: "#31363F",
        darkText: "#ecedee"
      },
    },
  },
  plugins: [],
};
