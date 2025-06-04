import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico', 'font/**/*', 'icons/*', 'games/**/*'],
      manifest: {
        name: 'Name of the Game',
        short_name: 'Party Games',
        description: 'A collection of party games for you and your friends.',
        theme_color: '#1d0f2e',
        background_color: '#1d0f2e',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192x192.webp',
            sizes: '192x192',
            type: 'image/webp'
          },
          {
            src: 'icons/icon-512x512.webp',
            sizes: '512x512',
            type: 'image/webp'
          }
        ],
      },
      strategies: 'generateSW',
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,webp,woff,woff2,ttf,eot,json}'
        ],
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'html-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              networkTimeoutSeconds: 10
            }
          }
        ],
        skipWaiting: true,
        clientsClaim: true
      }
    }),
    createHtmlPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true,
      }
    }),
    visualizer(),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      deleteOriginFile: false,
      verbose: true
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['name-of-the-game.stephanhagmann.ch']
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
})