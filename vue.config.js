const { defineConfig } = require('@vue/cli-service')
const { DefinePlugin } = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']

const packageJson = require('./package.json')

module.exports = defineConfig({
  chainWebpack: config => {
    config.resolve.alias.set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js'),
    config.plugin('CompressionWebpackPlugin').use(CompressionWebpackPlugin, [{
      filename: '[file].gz[query]',
      algorithm: 'gzip',
      test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
      threshold: 10240,
      minRatio: 0.8
    }]),
    config.plugin('DefinePlugin').use(DefinePlugin, [{
      'process.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false)
    }])
  },
  transpileDependencies: true,
  productionSourceMap: false,
  pwa: {
    name: process.env.VUE_APP_TITLE,
    themeColor: '#111111',
    msTileColor: '#111111',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'default',
    manifestOptions: {
      display_override: [
        "window-controls-overlay"
      ],
      background_color: "#111111",
      icons: [
        { 'src': 'icons/web-app-manifest-192x192.png', 'sizes': '192x192', 'type': 'image/png', 'purpose': "maskable any" },
        { 'src': 'icons/web-app-manifest-512x512.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': "maskable any" },
        { 'src': 'icons/monochrome-icon.png', 'sizes': '512x512', 'type': 'image/png', 'purpose': "monochrome", 'monet': true }
      ],
    },
    iconPaths: {
      favicon32: 'icons/favicon.ico',
      favicon16: 'icons/favicon.ico',
      appleTouchIcon: 'icons/apple-touch-icon.png',
      maskIcon: 'icons/web-app-manifest-512x512.png'
    }
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `
          @use "/src/assets/scss/utilities/_functions.scss" as *;
          @use "/src/assets/scss/utilities/_mixins.scss" as *;
          @use "/src/assets/scss/utilities/_variables.scss" as *;
        `,
      },
    },
  }
})
