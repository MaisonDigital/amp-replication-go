/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f2',
          100: '#dcf2e1',
          200: '#bce5c7',
          300: '#8dd1a0',
          400: '#57b471',
          500: '#359650',
          600: '#26773e',
          700: '#1f5f33',
          800: '#1c4c2b',
          900: '#122e17',
          950: '#0a1a0d',
        },
        secondary: {
          50: '#fdf4f3',
          100: '#fce7e4',
          200: '#f9d3ce',
          300: '#f4b5ab',
          400: '#ec8b7a',
          500: '#e06650',
          600: '#cd4f36',
          700: '#ab3f2a',
          800: '#8d3825',
          900: '#753325',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
    },
  },
  plugins: [],
}

