/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      animation: {
        'ping-slow': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
      }
    },
  },
  plugins: [],
}

