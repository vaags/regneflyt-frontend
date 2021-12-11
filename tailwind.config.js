const colors = require('tailwindcss/colors')
const plugin = require('tailwindcss/plugin')
const pseudoClasses = ['before', 'after']

module.exports = {
    content: ['./src/**/*.svelte', './public/index.html'],
    theme: {
        colors: {
            black: '#000',
            white: '#fff',
            gray: colors.stone,
            orange: colors.orange,
            red: colors.red,
            green: colors.emerald,
            blue: colors.sky,
            yellow: colors.amber,
        },
        extend: {
            rotate: {
                25.5: '25.5deg',
                35: '35deg',
                '-35': '-35deg',
            },
            spacing: {
                4.5: '1.125rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        plugin(({ addVariant, e }) => {
            addVariant('before', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.${e(`before${separator}${className}`)}::before`
                })
            })
            addVariant('after', ({ modifySelectors, separator }) => {
                modifySelectors(({ className }) => {
                    return `.${e(`after${separator}${className}`)}::after`
                })
            })
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
            }

            addUtilities(contentUtilities, pseudoClasses)
        }),
    ],
}
