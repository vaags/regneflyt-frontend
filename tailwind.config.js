const colors = require('tailwindcss/colors')

module.exports = {
  purge: ["./src/**/*.svelte", "./public/index.html"],
  darkMode: false,
  theme: {
    colors: {
      gray: colors.warmGray,
      orange: colors.orange,
      red: colors.red,
      green: colors.emerald,
      blue: colors.lightBlue,
      yellow: colors.amber
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ]
}
