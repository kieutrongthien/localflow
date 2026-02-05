<template>
  <div class="space-y-4">
    <div v-if="showOnboarding" class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Onboarding Checklist</h3>
      <ul class="text-sm list-disc pl-5">
        <li :class="stepClass(done.selectProject)">
          <button class="underline" @click="goSettings">Chọn thư mục dự án</button>
        </li>
        <li :class="stepClass(done.ensurePlanning)">Tạo .planning (tự động khi chọn thư mục)</li>
        <li :class="stepClass(done.wizardMetadata)">
          <button class="underline" @click="goSettings">Mở wizard metadata</button>
        </li>
        <li :class="stepClass(done.viewOverview)">Xem Overview</li>
      </ul>
      <div class="mt-3">
        <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="dismissOnboarding" aria-label="Dismiss onboarding">Ẩn checklist</button>
      </div>
    </div>
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
    <div v-if="indexerMs !== null || renderMs !== null" class="text-xs text-zinc-500">
      <span v-if="indexerMs !== null">Index: {{ indexerMs }} ms</span>
      <span v-if="renderMs !== null" class="ml-2">Render: {{ renderMs }} ms</span>
    </div>
  </div>
  <div class="rounded-xl border border-white/10 bg-white/5 p-4 mt-4">
    <h3 class="mb-2">Keyboard Shortcuts</h3>
    <ul class="text-sm list-disc pl-5 text-zinc-300">
      <li>Ctrl/Cmd + 1 → Overview</li>
      <li>Ctrl/Cmd + 2 → Backlog</li>
      <li>Ctrl/Cmd + 3 → Boards</li>
      <li>Ctrl/Cmd + 4 → Settings</li>
      <li>Ctrl/Cmd + Shift + B → Create Backup</li>
      <li>Ctrl/Cmd + Shift + E → Export Planning to JSON</li>
      <li>Ctrl/Cmd + Shift + I → Toggle DevTools (dev only)</li>
    </ul>
  </div>
  <div class="rounded-xl border border-white/10 bg-white/5 p-4 mt-4">
    <h3 class="mb-2">Release Notes (Internal)</h3>
    <div class="flex items-center gap-2">
      <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="generateReleaseNotes" aria-label="Generate release notes">Generate</button>
      <span class="text-sm text-zinc-400" v-if="releaseStatus">{{ releaseStatus }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

const totals = reactive({ epic: 0, story: 0, task: 0 })
const activities = ref<Array<{ id: number; type: string; createdAt: number; payload?: any }>>([])
const activityEnabled = ref(false)
const loadingIndex = ref(true)
const indexerMs = ref<number | null>(null)
const renderMs = ref<number | null>(null)
const projectPath = ref('')
const canNavigate = ref(false)
const emptyMessage = ref('Chưa chọn project — vào Settings để chọn thư mục project.')
const releaseStatus = ref('')
const router = useRouter()
const showOnboarding = ref(false)
const done = reactive({ selectProject: false, ensurePlanning: false, wizardMetadata: false, viewOverview: false })

onMounted(async () => {
  const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  projectPath.value = p || ''
  canNavigate.value = !!projectPath.value
  if (projectPath.value) {
    const t0 = performance.now()
    const idx = await window.localflow.getPlanningIndex({ projectPath: projectPath.value })
    indexerMs.value = Math.round(performance.now() - t0)
    const r0 = performance.now()
    totals.epic = idx.totals.epic
    totals.story = idx.totals.story
    totals.task = idx.totals.task
    renderMs.value = Math.round(performance.now() - r0)
  }
  loadingIndex.value = false
  // Mark viewed Overview
  try { await window.localflow.setSetting({ key: 'onb.viewOverview', value: 'true' }) } catch {}

  // Onboarding state from settings
  const batch = await window.localflow.getSettings({ keys: ['onb.selectProject', 'onb.ensurePlanning', 'onb.wizardMetadata', 'onb.viewOverview'] })
  done.selectProject = (batch.values['onb.selectProject'] || '') === 'true'
  done.ensurePlanning = (batch.values['onb.ensurePlanning'] || '') === 'true'
  done.wizardMetadata = (batch.values['onb.wizardMetadata'] || '') === 'true'
  done.viewOverview = (batch.values['onb.viewOverview'] || '') === 'true'
  showOnboarding.value = !(done.selectProject && done.ensurePlanning && done.wizardMetadata && done.viewOverview)

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

const goSettings = () => router.push('/settings')
const dismissOnboarding = async () => {
  showOnboarding.value = false
}

const stepClass = (ok: boolean) => ok ? 'text-emerald-400' : 'text-zinc-300'

const generateReleaseNotes = async () => {
  try {
    releaseStatus.value = 'Đang tạo...'
    const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
    if (!p) { releaseStatus.value = 'Chưa chọn project'; return }
    const res = await window.localflow.generateReleaseNotes({ projectPath: p, limit: 50 })
    releaseStatus.value = res.success ? `Đã lưu: ${res.path}` : 'Huỷ hoặc lỗi'
  } catch {
    releaseStatus.value = 'Tạo release notes thất bại'
  }
}
</script>

 
