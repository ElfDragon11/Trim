import { type Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1C1A17',    // Deep Black
        secondary: '#25221E',  // Charcoal Black
        accent: '#C19A6B',     // Earthy Brown
        neutral: '#5E452A',    // Warm Beige
        lightNeutral: '#6E573F',
        refinedBeige: '#A08C75',
        text: '#EAE6E1',       // Soft White
      },
    },
  },
  plugins: [],
} satisfies Config