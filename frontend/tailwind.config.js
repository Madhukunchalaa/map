/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#0a0f1e",
          card: "#161b2c",
          border: "#23293b"
        },
        brand: {
          light: "#00f2fe",
          DEFAULT: "#00d2ff",
          dark: "#00c9ff"
        },
        opportunity: {
          high: "#ef4444",
          medium: "#f59e0b",
          low: "#10b981"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
