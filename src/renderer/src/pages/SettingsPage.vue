<template>
  <div class="space-y-4">
    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Giao diện</h3>
      <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="toggleTheme">{{ themeLabel }}</button>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Activity Log</h3>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" :checked="activityEnabled" @change="toggleActivity($event)" />
        <span>Bật Activity Log (tùy chọn)</span>
      </label>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Indexer</h3>
      <label class="block text-sm mb-1">Exclude patterns (csv)</label>
      <input class="w-full rounded px-3 py-2 bg-white/10 border border-white/10" v-model="excludes" placeholder="*.tmp, .DS_Store" />
      <button class="mt-2 px-3 py-1 rounded bg-white/10 text-sm" @click="saveExcludes">Lưu</button>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Database</h3>
      <p class="text-sm text-zinc-400">Path: {{ dbPath }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const themeLabel = ref('Dark mode')
const activityEnabled = ref(false)
const excludes = ref('')
const dbPath = ref('')

onMounted(async () => {
  const { value } = await window.localflow.getSetting({ key: 'theme' })
  applyTheme(value === 'light' ? 'light' : 'dark')

  const { value: act } = await window.localflow.getSetting({ key: 'activityEnabled' })
  activityEnabled.value = act === 'true'

  const { value: ex } = await window.localflow.getSetting({ key: 'indexExcludes' })
  excludes.value = ex || ''

  const res = await window.localflow.getDatabasePath()
  dbPath.value = res.path
})

const applyTheme = (mode: 'dark' | 'light') => {
  const el = document.documentElement
  if (mode === 'dark') {
    el.classList.add('dark')
    themeLabel.value = 'Light mode'
  } else {
    el.classList.remove('dark')
    themeLabel.value = 'Dark mode'
  }
}

const toggleTheme = async () => {
  const isDark = document.documentElement.classList.contains('dark')
  const next = isDark ? 'light' : 'dark'
  applyTheme(next)
  await window.localflow.setSetting({ key: 'theme', value: next })
}

const toggleActivity = async (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  activityEnabled.value = checked
  await window.localflow.setSetting({ key: 'activityEnabled', value: checked ? 'true' : 'false' })
}

const saveExcludes = async () => {
  await window.localflow.setSetting({ key: 'indexExcludes', value: excludes.value })
}
</script>
