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
    { path: '/settings', name: 'settings', component: SettingsPage },
    { path: '/story-editor', name: 'story-editor', component: () => import('./pages/StoryEditorPage.vue') }
    ,{ path: '/task-editor', name: 'task-editor', component: () => import('./pages/TaskEditorPage.vue') }
    ,{ path: '/detail', name: 'detail', component: () => import('./pages/BacklogDetailPage.vue') }
    ,{ path: '/epic-editor', name: 'epic-editor', component: () => import('./pages/EpicEditorPage.vue') }
  ]
})

createApp(App).use(router).mount('#app')
