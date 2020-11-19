const colors = require('tailwindcss/colors')

module.exports = {
  purge: ["./src/**/*.svelte", "./public/index.html"],
  theme: {
    colors: {
      gray: colors.warmGray,
      orange: colors.orange,
      red: colors.red,
      green: colors.emerald,
      blue: colors.lightBlue,
      yellow: colors.amber
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
  ]
}
