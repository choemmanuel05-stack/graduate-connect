/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      colors: {
        'gc-blue': '#0A66C2',
        'gc-teal': '#0D9488',
        'gc-bg':   '#F1F5F9',
        'modern-blue': '#0A66C2',
      },
      borderRadius: {
        'xl':  '14px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'blue':    '0 4px 14px rgba(10,102,194,0.25)',
        'blue-lg': '0 8px 30px rgba(10,102,194,0.35)',
        'card':    '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
        'card-lg': '0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -2px rgba(15,23,42,0.04)',
        'modal':   '0 25px 50px -12px rgba(15,23,42,0.18)',
      },
    },
  },
  plugins: [],
}
