/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            DEFAULT: '#1B00B2',
            dark: '#120083',
            light: '#3B21E5',
            soft: '#EEF0FF'
          },
          green: {
            DEFAULT: '#00C853',
            dark: '#009E40',
            light: '#66FFA6',
            soft: '#E6F9EE'
          },
          navy: '#0F172A',
          dark: '#0B1120'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 25px -5px rgba(27, 0, 178, 0.3)',
        'glow-green': '0 0 25px -5px rgba(0, 200, 83, 0.4)',
        'card-hover': '0 20px 30px -10px rgba(15, 23, 42, 0.08)',
      }
    },
  },
  plugins: [],
}
