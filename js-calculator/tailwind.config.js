/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    colors: {
      darkgreen: "#4aa3a3",
      green: "#89b7b7",
      lightgreen: "#c0d8d8",
      darkgray: "gray",
      gray: "#8d8d8d",
      lightgray: "#b3b3b3",
      orange: "orange",
    },
    fontFamily: {
      mono: ['"Share Tech Mono"', "monospace"],
      digital: ["Digital"],
    },
    extend: {},
    // screens: {
    //   sm: "640px",
    // },
  },
  plugins: [],
};
