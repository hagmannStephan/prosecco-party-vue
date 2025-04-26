import { createApp } from 'vue'
import './style.css'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from './views/App.vue'
import ActivityConfig from './views/games/activity/ActivityConfig.vue';


const routes = [
    {path: '/activity/game-config', component: ActivityConfig},
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

createApp(App).use(router).mount('#app')
