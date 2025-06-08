import { createApp } from 'vue'
import './style.css'
import { createWebHistory, createRouter } from 'vue-router'
import {createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import i18n from './i18n'

// Add Eruda for console debugging on mobile (remove if not needed)
// import eruda from 'eruda'
// eruda.init()

// Create a Pinia store
const pinia = createPinia()
// Make Pinia persist its state
pinia.use(piniaPluginPersistedstate);

import App from './views/App.vue'
import Home from './views/Home.vue'
import SchnapsideeConfig from './views/games/schnapsidee/SchnapsideeConfig.vue'
import SchnapsideeBreak from './views/games/schnapsidee/SchnapsideeBreak.vue'
import SchnapsideeGame from './views/games/schnapsidee/SchnapsideeGame.vue'
import SchnapsideeDone from './views/games/schnapsidee/SchnapsideeDone.vue'
import SchnapsideeRanked from './views/games/schnapsidee/SchnapsideeRanked.vue'
import SchnapsideeTimeUp from './views/games/schnapsidee/SchnapsideeTimeUp.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/schnapsidee/game-config', component: SchnapsideeConfig },
  { path: '/schnapsidee/break', component: SchnapsideeBreak },
  { path: '/schnapsidee', component: SchnapsideeGame },
  { path: '/schnapsidee/done', component: SchnapsideeDone },
  { path: '/schnapsidee/ranked', component: SchnapsideeRanked },
  { path: '/schnapsidee/time-up', component: SchnapsideeTimeUp },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


createApp(App)
  .use(router)
  .use(pinia)
  .use(i18n)
  .mount('#app')
