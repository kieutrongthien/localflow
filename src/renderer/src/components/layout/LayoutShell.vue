<template>
  <div :class="['min-h-screen grid grid-cols-1', collapsed ? 'md:grid-cols-[72px_1fr]' : 'md:grid-cols-[240px_1fr]', 'bg-white text-zinc-900 dark:bg-[radial-gradient(circle_at_top,_#111,_#0b0b0b)] dark:text-zinc-100']">
    <aside :class="['hidden md:block border-r', collapsed ? 'p-2' : 'p-4', 'bg-gray-50 border-gray-200 dark:bg-white/5 dark:border-white/10']" aria-label="Sidebar navigation" role="navigation">
      <div class="flex items-center justify-between font-semibold">
        <div class="flex items-center gap-2">
          <img :src="logoSrc" alt="LocalFlow logo" class="w-8 h-8" />
          <span v-if="!collapsed">LocalFlow</span>
        </div>
        <button class="px-2 py-1 rounded bg-white/10 text-xs" @click="toggle" aria-label="Toggle sidebar">{{ collapsed ? '›' : '‹' }}</button>
      </div>
      <nav :class="['flex flex-col gap-2 mt-4', collapsed ? 'items-center' : '']">
        <RouterLink to="/" :class="linkClass('/')">
          <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3l9 8h-3v10H6V11H3z"/></svg>
          <span v-else>Overview</span>
        </RouterLink>
        <RouterLink to="/backlog" :class="linkClass('/backlog')">
          <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/></svg>
          <span v-else>Backlog</span>
        </RouterLink>
        <RouterLink to="/boards" :class="linkClass('/boards')">
          <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 4h7v16H3zm11 0h7v10h-7z"/></svg>
          <span v-else>Boards</span>
        </RouterLink>
        <RouterLink to="/settings" :class="linkClass('/settings')">
          <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 4a8.94 8.94 0 01-.5 2.94l2.12 1.64-2 3.46-2.54-1a9.08 9.08 0 01-2.54 1L14 22H10l-.48-2.02a9.08 9.08 0 01-2.54-1l-2.54 1-2-3.46 2.12-1.64A8.94 8.94 0 013.06 12c0-1.02.18-2 .5-2.94L1.44 7.42l2-3.46 2.54 1A9.08 9.08 0 018.52 4L10 2h4l1.48 2.02a9.08 9.08 0 012.54 1l2.54-1 2 3.46-2.12 1.64c.32.94.5 1.92.5 2.94z"/></svg>
          <span v-else>Settings</span>
        </RouterLink>
      </nav>
    </aside>
    <div class="flex flex-col">
      <header class="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <div class="flex items-center gap-2">
          <slot name="breadcrumb"></slot>
        </div>
        <slot name="actions"></slot>
      </header>
      <main class="p-6 overflow-auto">
        <div class="max-w-6xl mx-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
const logoSrc = new URL('../../assets/logo.svg', import.meta.url).href
const route = useRoute()
const collapsed = ref(false)
const linkClass = (to: string) => {
  const base = 'w-full text-left rounded-lg px-3 py-2 flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400'
  const inactive = 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'
  const active = 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-white/10 dark:text-white dark:border-white/10'
  return [base, route.path === to ? active : inactive]
}
const toggle = () => {
  collapsed.value = !collapsed.value
  try { localStorage.setItem('sidebarCollapsed', collapsed.value ? '1' : '0') } catch {}
}
onMounted(() => {
  try { collapsed.value = localStorage.getItem('sidebarCollapsed') === '1' } catch {}
})
</script>
