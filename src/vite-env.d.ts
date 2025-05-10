/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New content available, click on reload button to update.')
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
})