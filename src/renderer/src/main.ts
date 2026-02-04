import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { createRouter, createWebHashHistory } from 'vue-router'
import OverviewPage from './pages/OverviewPage.vue'
import BacklogPage from './pages/BacklogPage.vue'
import BoardsPage from './pages/BoardsPage.vue'
import SettingsPage from './pages/SettingsPage.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'overview', component: OverviewPage },
    { path: '/backlog', name: 'backlog', component: BacklogPage },
    { path: '/boards', name: 'boards', component: BoardsPage },
    { path: '/settings', name: 'settings', component: SettingsPage }
  ]
})

createApp(App).use(router).mount('#app')
