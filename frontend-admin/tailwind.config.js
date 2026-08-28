/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        silk: '#FBF7F0',      // page background
        ink: '#241C15',       // primary text
        wine: {
          DEFAULT: '#7A2131', // primary brand / actions
          dark: '#5C1826',
          light: '#96324439',
        },
        zari: {
          DEFAULT: '#B9862F', // accent / highlights
          light: '#E8D2A6',
        },
        sage: '#5C7259',      // success / positive
        rust: '#B4462F',      // danger / destructive
        border: '#E4D9C8',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '10px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(36, 28, 21, 0.06), 0 1px 8px rgba(36, 28, 21, 0.04)',
      },
    },
  },
  plugins: [],
};
