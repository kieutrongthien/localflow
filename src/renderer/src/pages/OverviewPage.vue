<template>
  <div class="space-y-4">
    <div class="grid md:grid-cols-3 gap-4">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4" aria-label="Epics total">
        <div class="flex items-center gap-2 text-sm text-zinc-400"><span>📦 Epics</span></div>
        <div v-if="loadingIndex" class="h-6 w-16 rounded bg-white/10 animate-pulse"></div>
        <div v-else class="text-2xl font-semibold">{{ totals.epic }}</div>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4" aria-label="Stories total">
        <div class="flex items-center gap-2 text-sm text-zinc-400"><span>📚 Stories</span></div>
        <div v-if="loadingIndex" class="h-6 w-16 rounded bg-white/10 animate-pulse"></div>
        <div v-else class="text-2xl font-semibold">{{ totals.story }}</div>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4" aria-label="Tasks total">
        <div class="flex items-center gap-2 text-sm text-zinc-400"><span>🧩 Tasks</span></div>
        <div v-if="loadingIndex" class="h-6 w-16 rounded bg-white/10 animate-pulse"></div>
        <div v-else class="text-2xl font-semibold">{{ totals.task }}</div>
      </div>
    </div>

    <div class="flex gap-2">
      <RouterLink :class="['px-4 py-2 rounded-full', canNavigate ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-60 cursor-not-allowed']" to="/backlog" :aria-disabled="!canNavigate" aria-label="Open Backlog">Backlog</RouterLink>
      <RouterLink :class="['px-4 py-2 rounded-full', canNavigate ? 'bg-white/10 hover:bg-white/20' : 'bg-white/5 opacity-60 cursor-not-allowed']" to="/boards" :aria-disabled="!canNavigate" aria-label="Open Boards">Boards</RouterLink>
      <RouterLink class="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20" to="/settings" aria-label="Open Settings">Settings</RouterLink>
    </div>

    <div v-if="!loadingIndex && !projectPath && emptyMessage" class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
      {{ emptyMessage }}
    </div>
    <div v-else-if="!loadingIndex && totals.epic + totals.story + totals.task === 0" class="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-zinc-400">
      Chưa có dữ liệu trong .planning — hãy tạo Epic/Story/Task từ editors hoặc import JSON.
    </div>

    <div v-if="activityEnabled" class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Activity gần đây</h3>
      <ul v-if="activities.length" class="list-none p-0 text-sm" aria-label="Recent activity list">
        <li v-for="a in activities" :key="a.id" class="border-t border-white/5 py-1 flex items-center gap-2">
          <span class="text-zinc-400">{{ new Date(a.createdAt).toLocaleString() }}</span>
          <span class="font-medium">{{ a.type }}</span>
          <RouterLink v-if="linkForActivity(a)" :to="linkForActivity(a)" class="ml-auto underline hover:opacity-80">Open</RouterLink>
        </li>
      </ul>
      <div v-else class="text-sm text-zinc-400">Chưa có activity nào.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const totals = reactive({ epic: 0, story: 0, task: 0 })
const activities = ref<Array<{ id: number; type: string; createdAt: number; payload?: any }>>([])
const activityEnabled = ref(false)
const loadingIndex = ref(true)
const projectPath = ref('')
const canNavigate = ref(false)
const emptyMessage = ref('Chưa chọn project — vào Settings để chọn thư mục project.')

onMounted(async () => {
  const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  projectPath.value = p || ''
  canNavigate.value = !!projectPath.value
  if (projectPath.value) {
    const idx = await window.localflow.getPlanningIndex({ projectPath: projectPath.value })
    totals.epic = idx.totals.epic
    totals.story = idx.totals.story
    totals.task = idx.totals.task
  }
  loadingIndex.value = false

  const { value: act } = await window.localflow.getSetting({ key: 'activityEnabled' })
  activityEnabled.value = act === 'true'
  if (activityEnabled.value) {
    const res = await window.localflow.listActivity({ limit: 10 })
    activities.value = res.entries.map((e) => ({ id: e.id, type: e.type, createdAt: e.createdAt, payload: e.payload }))
  }
})

const linkForActivity = (a: { payload?: any }) => {
  const p = a?.payload?.path
  if (typeof p === 'string' && p.includes('/.planning/')) {
    return `/detail?path=${encodeURIComponent(p)}`
  }
  return ''
}
</script>
