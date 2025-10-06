import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#19e6a2',
        'background-light': '#f6f8f7',
        'background-dark': '#11211c',
      },
      fontFamily: {
        display: ['Be Vietnam Pro', 'sans-serif'],
      },
      borderRadius: {
        lg: '1rem',
        xl: '1.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/container-queries')],
} satisfies Config