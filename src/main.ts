import { createApp } from 'vue'
import './style.css'
import { createWebHistory, createRouter } from 'vue-router'

import App from './views/App.vue'
import Home from './views/Home.vue'
import ActivityConfig from './views/games/activity/ActivityConfig.vue'
import ActivityGame from './views/games/activity/ActivityGame.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/activity/game-config', component: ActivityConfig },
  { path: '/activity', component: ActivityGame },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(router).mount('#app')
