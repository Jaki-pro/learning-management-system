import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme
        'primary-light': '#ffffff',
        'secondary-light': '#f1f5f9',
        'accent-light': '#3b82f6',
        'text-primary-light': '#0f172a',
        'text-secondary-light': '#64748b',

        // Dark theme
        'primary-dark': '#0f172a',
        'secondary-dark': '#1e293b',
        'accent-dark': '#38bdf8',
        'text-primary-dark': '#f1f5f9',
        'text-secondary-dark': '#94a3b8',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
export default config