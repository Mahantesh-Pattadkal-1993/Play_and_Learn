/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        "primary-dark": "#312E81",
        secondary: "#EC4899",
        accent: "#F59E0B",
        "dark-bg": "#0F172A",
        "card-bg": "#1E293B",
        "light-card": "#FFFFFF",
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans", "system-ui"],
        mono: ["Fira Code", "Monaco", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 2s ease-in-out infinite",
        fadeIn: "fadeIn 0.3s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
