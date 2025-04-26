import { createApp } from 'vue'
import './style.css'
import { createWebHistory, createRouter } from 'vue-router'

import App from './views/App.vue'
import ActivityConfig from './views/games/activity/ActivityConfig.vue';
import Home from './views/Home.vue';


const routes = [
    {path: '/', component: Home},
    {path: '/activity/game-config', component: ActivityConfig},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).mount('#app')
