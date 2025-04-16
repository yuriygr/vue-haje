import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import viteCompression from 'vite-plugin-compression'
import { fileURLToPath, URL } from 'node:url'
import packageJson from './package.json' assert { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: process.env.VITE_APP_TITLE || packageJson.name,
        theme_color: '#111111',
        background_color: '#111111',
        display_override: ['window-controls-overlay'],
        icons: [
          { 
            src: 'icons/web-app-manifest-192x192.png', 
            sizes: '192x192', 
            type: 'image/png', 
            purpose: 'maskable any' 
          },
          { 
            src: 'icons/web-app-manifest-512x512.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'maskable any' 
          },
          { 
            src: 'icons/monochrome-icon.png', 
            sizes: '512x512', 
            type: 'image/png', 
            purpose: 'monochrome' 
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}']
      },
      includeAssets: [
        'icons/favicon.ico',
        'icons/apple-touch-icon.png',
        'icons/web-app-manifest-512x512.png'
      ]
    }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240,
      filter: new RegExp(`\\.(${['js', 'css'].join('|')})$`),
      deleteOriginFile: false
    })
  ],
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
    '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': JSON.stringify(false),
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version)
  },
  resolve: {
    alias: {
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "/src/assets/scss/utilities/_functions.scss" as *;
          @use "/src/assets/scss/utilities/_mixins.scss" as *;
          @use "/src/assets/scss/utilities/_variables.scss" as *;
        `
      }
    }
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})