<template>
  <aside :class="['h-full border-r', dark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-gray-50']" aria-label="Sidebar navigation">
    <div class="flex items-center justify-between px-3 py-2">
      <span class="text-sm font-semibold">Localflow</span>
      <button class="px-2 py-1 rounded bg-white/10 text-xs" @click="toggle" aria-label="Toggle sidebar">{{ collapsed ? '›' : '‹' }}</button>
    </div>
    <nav class="space-y-1 px-2">
      <RouterLink :class="linkClass('/')">
        <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3l9 8h-3v10H6V11H3z"/></svg>
        <span v-else>Overview</span>
      </RouterLink>
      <RouterLink :class="linkClass('/backlog')">
        <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h10v2H4z"/></svg>
        <span v-else>Backlog</span>
      </RouterLink>
      <RouterLink :class="linkClass('/boards')">
        <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 4h7v16H3zm11 0h7v10h-7z"/></svg>
        <span v-else>Boards</span>
      </RouterLink>
      <RouterLink :class="linkClass('/settings')">
        <svg v-if="collapsed" width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 8a4 4 0 100 8 4 4 0 000-8zm8.94 4a8.94 8.94 0 01-.5 2.94l2.12 1.64-2 3.46-2.54-1a9.08 9.08 0 01-2.54 1L14 22H10l-.48-2.02a9.08 9.08 0 01-2.54-1l-2.54 1-2-3.46 2.12-1.64A8.94 8.94 0 013.06 12c0-1.02.18-2 .5-2.94L1.44 7.42l2-3.46 2.54 1A9.08 9.08 0 018.52 4L10 2h4l1.48 2.02a9.08 9.08 0 012.54 1l2.54-1 2 3.46-2.12 1.64c.32.94.5 1.92.5 2.94z"/></svg>
        <span v-else>Settings</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

defineProps<{ dark?: boolean }>()
const route = useRoute()
const collapsed = ref(false)

const linkClass = (to: string) => [
  'flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors duration-200',
  route.path === to ? 'bg-white/10' : 'hover:bg-white/5'
]

const toggle = () => {
  collapsed.value = !collapsed.value
  try { localStorage.setItem('sidebarCollapsed', collapsed.value ? '1' : '0') } catch {}
}

onMounted(() => {
  try { collapsed.value = localStorage.getItem('sidebarCollapsed') === '1' } catch {}
})
</script>

<style scoped>
aside { width: 240px; }
</style>
