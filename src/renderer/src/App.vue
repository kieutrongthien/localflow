<template>
  <LayoutShell>
    <template #actions>
      <div class="flex items-center gap-2">
        <code class="px-3 py-1 rounded-full bg-white/10">Ping: {{ pingValue }}</code>
        <code class="px-3 py-1 rounded-full bg-white/10">Version: {{ version }}</code>
        <UIButton variant="secondary" @click="toggleTheme">{{ themeLabel }}</UIButton>
      </div>
    </template>
    <RouterView />
  </LayoutShell>
  <Toast v-if="toast.message" :type="toast.type" :message="toast.message" :title="toast.title" :duration="toast.duration" @hidden="toast.message = ''" />
  <div class="sr-only" aria-live="polite">{{ srLive }}</div>
</template>

<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import Toast from './components/Toast.vue'
import LayoutShell from './components/layout/LayoutShell.vue'
import UIButton from './components/UI/Button.vue'
import type { PlanningIndexResult, PlanningItem } from '../../shared/planning/types'

const pingValue = ref('...')
const version = ref('...')
const themeLabel = ref('Dark mode')
const toast = reactive<{ type?: 'success' | 'error' | 'info'; title?: string; message: string; duration?: number }>({ message: '' })
const router = useRouter()
const srLive = ref('')

// Optional: planning index subscriptions retained for Boards keyboard + overview if needed
const planningItems = ref<PlanningItem[]>([])
const applyPlanningIndex = (payload: PlanningIndexResult) => {
  planningItems.value = payload.items
}
let unsubscribePlanning: (() => void) | null = null
let offWatchError: (() => void) | undefined
let offWatchRecovered: (() => void) | undefined

onMounted(async () => {
  pingValue.value = window.localflow?.ping() ?? 'unavailable'
  version.value = (await window.localflow?.getVersion?.()) ?? 'n/a'

  unsubscribePlanning = window.localflow.onPlanningIndexUpdated(applyPlanningIndex)
  offWatchError = window.localflow.onWatchError?.((payload) => {
    toast.type = 'error'; toast.message = 'Watcher lỗi: ' + (payload?.message || '')
  })
  offWatchRecovered = window.localflow.onWatchRecovered?.(() => {
    toast.type = 'success'; toast.message = 'Watcher đã khôi phục'
  })

  const { value } = await window.localflow.getSetting({ key: 'theme' })
  // Default to light when unset
  applyTheme(value === 'dark' ? 'dark' : 'light')

  // Keyboard shortcuts (dev/prod internal)
  const onKey = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable) return
    const ctrl = e.ctrlKey || e.metaKey
    if (!ctrl) return
    if (e.key === '1') { e.preventDefault(); router.push('/') }
    else if (e.key === '2') { e.preventDefault(); router.push('/backlog') }
    else if (e.key === '3') { e.preventDefault(); router.push('/boards') }
    else if (e.key === '4') { e.preventDefault(); router.push('/settings') }
    else if (e.shiftKey && (e.key.toLowerCase() === 'b')) { e.preventDefault(); createBackup() }
    else if (e.shiftKey && (e.key.toLowerCase() === 'e')) { e.preventDefault(); exportJson() }
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})

onBeforeUnmount(() => {
  try { unsubscribePlanning?.() } catch {}
  try { offWatchError?.() } catch {}
  try { offWatchRecovered?.() } catch {}
})

const applyTheme = (mode: 'dark' | 'light') => {
  const el = document.documentElement
  if (mode === 'dark') { el.classList.add('dark'); themeLabel.value = 'Light mode' }
  else { el.classList.remove('dark'); themeLabel.value = 'Dark mode' }
}

const toggleTheme = async () => {
  const isDark = document.documentElement.classList.contains('dark')
  const next = isDark ? 'light' : 'dark'
  applyTheme(next)
  await window.localflow.setSetting({ key: 'theme', value: next })
}

// Export / Import retained for shortcuts
const exportJson = async () => {
  try {
    const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
    if (!p) { toast.type = 'error'; toast.message = 'Chưa chọn project'; return }
    const res = await window.localflow.exportPlanningToJson({ projectPath: p })
    toast.type = res.success ? 'success' : 'error'
    toast.message = res.success ? 'Đã export JSON' : 'Export thất bại'
    srLive.value = toast.message
  } catch (e) { toast.type = 'error'; toast.message = 'Export lỗi' }
}

const importJson = async () => {
  try {
    const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
    if (!p) { toast.type = 'error'; toast.message = 'Chưa chọn project'; return }
    const res = await window.localflow.importPlanningFromJson({ projectPath: p })
    toast.type = res.success ? 'success' : 'error'
    toast.message = res.success ? 'Đã import JSON' : 'Import thất bại'
    srLive.value = toast.message
  } catch (e) { toast.type = 'error'; toast.message = 'Import lỗi' }
}

const createBackup = async () => {
  try {
    const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
    if (!p) { toast.type = 'error'; toast.message = 'Chưa chọn project'; return }
    const res = await window.localflow.createBackup({ projectPath: p })
    toast.type = res.success ? 'success' : 'error'
    toast.message = res.success ? 'Đã tạo backup' : 'Backup thất bại'
    srLive.value = toast.message
  } catch (e) { toast.type = 'error'; toast.message = 'Backup lỗi' }
}
</script>
