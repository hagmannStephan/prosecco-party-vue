import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({ 
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        'name': 'Name of the Game',
        'short_name': 'Party Games',
        'description': 'A collection of party games for you and your friends.',
        'theme_color': '#811e73',
        'background_color': '#300056',
        'display': 'standalone',
        'orientation': 'portrait',
        'start_url': '/',
        // TODO: Add icons
      },
      workbox: {
        // Use the default Workbox options for caching and offline support
        globPatterns: [
          // Your app's main assets
          'index.html',
          'favicon.ico',
          'manifest.webmanifest',
          
          // Your specific static files
          'icons/plus-1.svg',
          'icons/refresh.svg',
          'font/Noto_Sans/NotoSans-SemiBold.ttf',
          
          // JavaScript and CSS (including your style.css which gets processed)
          '**/*.js',
          '**/*.css'
        ],
        // Ensure navigations work offline
        navigateFallback: 'index.html'
      }
    })
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
})
