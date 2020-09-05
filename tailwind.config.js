module.exports = {
  purge: ["./src/**/*.svelte", "./public/index.html"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [
    require('@tailwindcss/custom-forms'),
  ],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
}
