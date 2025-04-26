import { createApp } from 'vue'
import './style.css'
import { createMemoryHistory, createRouter } from 'vue-router'

import HomeView from './views/HomeView.vue'

const routes = [
    {path: '/', component: HomeView},
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(HomeView).use(router).mount('#app')
