module.exports = {
  purge: ["./src/**/*.svelte", "./public/index.html"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/custom-forms'),
  ],
}
