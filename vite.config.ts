import { defineConfig } from 'vitest/config'
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
  test: {
    environment: 'jsdom', // needed for DOM-like environment
    globals: true,        // optional, allows `describe/test/expect` without imports
  },
})
