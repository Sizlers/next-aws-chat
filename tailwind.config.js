module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        main: {
          900: '#000070',
          DEFAULT: '#2A3FD6',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
