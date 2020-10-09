module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ['./public/**/*.html', './src/**/*.vue'],
  theme: {
    extend: {
      colors: {
        blackish: '#333333',
      },
    },
  },
  variants: {
    backgroundColor: ['odd', 'hover', 'focus', 'even'],
  },
  plugins: [],
}
