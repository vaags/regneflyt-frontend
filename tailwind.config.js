const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const pseudoClasses = ['before', 'after']

module.exports = {
  purge: ["./src/**/*.svelte", "./public/index.html"],
  darkMode: false,
  theme: {
    colors: {
      black: '#000',
      white: '#fff',
      gray: colors.warmGray,
      orange: colors.orange,
      red: colors.red,
      green: colors.emerald,
      blue: colors.lightBlue,
      yellow: colors.amber
    },
    extend: {
      rotate: {
        '25.5': '25.5deg',
        '35': '35deg',
        '-35': '-35deg',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: pseudoClasses,
      width: pseudoClasses,
      height: pseudoClasses,
      position: pseudoClasses,
      transform: pseudoClasses,
      inset: pseudoClasses,
      rotate: pseudoClasses,
      borderRadius: pseudoClasses,
      borderWidth: pseudoClasses,
      borderColor: pseudoClasses
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    plugin(({ addVariant, e }) => {
      addVariant('before', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`before${separator}${className}`)}::before`;
        });
      });
      addVariant('after', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`after${separator}${className}`)}::after`;
        });
      });
    }),
    plugin(({ addUtilities }) => {
      const contentUtilities = {
        '.content': {
          content: 'attr(data-content)',
        },
        '.content-before': {
          content: 'attr(data-before)',
        },
        '.content-after': {
          content: 'attr(data-after)',
        },
      };

      addUtilities(contentUtilities, pseudoClasses);
    }),
  ]
}
