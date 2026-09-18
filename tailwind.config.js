/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        hospital: {
          dark: '#0B1120',
          card: '#1E293B',
          surface: '#151E32',
          border: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8',
          accent: '#0284C7',
          success: '#10B981',
          warning: '#F59E0B',
          urgent: '#F97316',
          critical: '#EF4444',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
