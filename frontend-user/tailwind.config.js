/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        silk: '#FBF7F0',
        ink: '#241C15',
        wine: {
          DEFAULT: '#7A2131',
          dark: '#5C1826',
        },
        zari: {
          DEFAULT: '#B9862F',
          light: '#E8D2A6',
        },
        sage: '#5C7259',
        rust: '#B4462F',
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
      backgroundImage: {
        'wine-fade': 'linear-gradient(135deg, #7A2131 0%, #5C1826 100%)',
      },
    },
  },
  plugins: [],
};
