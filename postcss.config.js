const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
    plugins: [
        require('@tailwindcss/jit'),
        require('autoprefixer'),
        // Minify if prod
        !dev &&
            require('cssnano')({
                preset: ['default', { discardComments: { removeAll: true } }],
            }),
    ],
}
