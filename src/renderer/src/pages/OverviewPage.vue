<template>
  <div class="space-y-4">
    <div class="grid md:grid-cols-3 gap-4">
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <div class="text-sm text-zinc-400">Epics</div>
        <div class="text-2xl font-semibold">{{ totals.epic }}</div>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <div class="text-sm text-zinc-400">Stories</div>
        <div class="text-2xl font-semibold">{{ totals.story }}</div>
      </div>
      <div class="rounded-xl border border-white/10 bg-white/5 p-4">
        <div class="text-sm text-zinc-400">Tasks</div>
        <div class="text-2xl font-semibold">{{ totals.task }}</div>
      </div>
    </div>

    <div class="flex gap-2">
      <RouterLink to="/backlog" class="px-4 py-2 rounded-full bg-white/10">Backlog</RouterLink>
      <RouterLink to="/boards" class="px-4 py-2 rounded-full bg-white/10">Boards</RouterLink>
      <RouterLink to="/settings" class="px-4 py-2 rounded-full bg-white/10">Settings</RouterLink>
    </div>

    <div v-if="activityEnabled" class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Activity gần đây</h3>
      <ul class="list-none p-0 text-sm">
        <li v-for="a in activities" :key="a.id" class="border-t border-white/5 py-1">
          <span class="text-zinc-400 mr-2">{{ new Date(a.createdAt).toLocaleString() }}</span>
          <span class="font-medium">{{ a.type }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

const totals = reactive({ epic: 0, story: 0, task: 0 })
const activities = ref<Array<{ id: number; type: string; createdAt: number }>>([])
const activityEnabled = ref(false)

onMounted(async () => {
  const { value: projectPath } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  if (projectPath) {
    const idx = await window.localflow.getPlanningIndex({ projectPath })
    totals.epic = idx.totals.epic
    totals.story = idx.totals.story
    totals.task = idx.totals.task
  }

  const { value: act } = await window.localflow.getSetting({ key: 'activityEnabled' })
  activityEnabled.value = act === 'true'
  if (activityEnabled.value) {
    const res = await window.localflow.listActivity({ limit: 10 })
    activities.value = res.entries.map((e) => ({ id: e.id, type: e.type, createdAt: e.createdAt }))
  }
})
</script>
