/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#b91c1c", // deep red accent
        accent: "#f59e0b", // amber accent
        surface: "#f8fafc",
      },
      borderRadius: {
        card: "18px",
      },
    },
  },
  plugins: [],
};
