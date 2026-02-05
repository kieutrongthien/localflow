<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-[260px_1fr] bg-[radial-gradient(circle_at_top,_#1a1a1a,_#0d0d0d)] text-zinc-100 font-[Inter]">
    <aside class="hidden md:block border-r border-white/10 p-4 bg-white/5">
      <div class="flex items-center gap-2 font-bold">
        <img src="./assets/logo.svg" alt="LocalFlow logo" class="w-10 h-10" />
        <span>LocalFlow</span>
      </div>
      <nav class="flex flex-col gap-2 mt-4">
        <RouterLink to="/" class="w-full text-left bg-gradient-to-r from-brand to-brand-secondary text-slate-900 rounded-lg px-3 py-2">Overview</RouterLink>
        <RouterLink to="/backlog" class="w-full text-left bg-white/10 rounded-lg px-3 py-2">Backlog</RouterLink>
        <RouterLink to="/boards" class="w-full text-left bg-white/10 rounded-lg px-3 py-2">Boards</RouterLink>
        <RouterLink to="/settings" class="w-full text-left bg-white/10 rounded-lg px-3 py-2">Settings</RouterLink>
      </nav>
    </aside>
    <main class="p-8">
      <header class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-xl font-semibold">Local-first backlog planner</h1>
        </div>
        <div class="flex items-center gap-2">
          <code class="px-3 py-1 rounded-full bg-white/10">Ping: {{ pingValue }}</code>
          <code class="px-3 py-1 rounded-full bg-white/10">Version: {{ version }}</code>
          <button class="px-3 py-1 rounded-full bg-white/10" @click="toggleTheme">{{ themeLabel }}</button>
        </div>
      </header>
      <section class="w-full max-w-3xl text-left p-10 rounded-2xl bg-white/5 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <img src="./assets/logo.svg" alt="LocalFlow logo" class="logo" />
      <h1>LocalFlow</h1>
      <p>Local-first backlog planner. Electron + Vue scaffold đang sẵn sàng.</p>
      <code>Ping từ preload: {{ pingValue }}</code>
      <code>Version: {{ version }}</code>

      <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
        <h2>Thao tác README</h2>
        <button @click="handleSelect">Chọn thư mục dự án</button>
        <p v-if="projectPath">Đã chọn: {{ projectPath }}</p>
        <p v-if="planningPath">.planning: {{ planningPath }}</p>

        <ul class="status-list" v-if="projectPath">
          <li>Planning {{ planningCreated ? 'đã tạo' : 'tồn tại sẵn' }}</li>
          <li>README {{ readmeCreated ? 'vừa tạo mới' : 'sẵn sàng' }}</li>
        </ul>

        <div class="flex gap-2 flex-wrap" v-if="projectPath">
          <button class="px-4 py-2 rounded-full bg-gradient-to-r from-brand to-brand-secondary text-slate-900" @click="loadReadme">Đọc README.md</button>
          <button class="px-4 py-2 rounded-full bg-gradient-to-r from-brand to-brand-secondary text-slate-900" @click="saveReadme">Lưu README.md</button>
        </div>

        <textarea class="w-full rounded-xl px-3 py-2 bg-white/10 border border-white/10 min-h-[120px] font-mono" v-model="readme" rows="6" :disabled="!projectPath" placeholder="# README.md" />
        <p class="text-emerald-400 text-sm" v-if="status">{{ status }}</p>
      </div>

      <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3" v-if="projectPath">
        <h2>Metadata dự án</h2>
        <div class="grid gap-4 md:grid-cols-2">
          <label class="flex flex-col gap-1">
            <span class="text-sm">Tên dự án *</span>
            <input class="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/10" type="text" v-model="metadata.name" placeholder="LocalFlow" />
            <small class="text-red-400 text-xs" v-if="errors.name">{{ errors.name }}</small>
          </label>

          <label class="md:col-span-2 flex flex-col gap-1">
            <span class="text-sm">Mô tả *</span>
            <textarea class="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/10" rows="3" v-model="metadata.description" placeholder="Mô tả dự án" />
            <small class="text-red-400 text-xs" v-if="errors.description">{{ errors.description }}</small>
          </label>

          <label class="md:col-span-2 flex flex-col gap-1">
            <span class="text-sm">Team (nhập tên, cách nhau bằng dấu phẩy)</span>
            <input class="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/10" type="text" v-model="metadata.teamInput" placeholder="Bieber, Colin" />
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm">Ngày bắt đầu *</span>
            <input class="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/10" type="date" v-model="metadata.startDate" />
            <small class="text-red-400 text-xs" v-if="errors.startDate">{{ errors.startDate }}</small>
          </label>

          <label class="flex flex-col gap-1">
            <span class="text-sm">Ngày kết thúc *</span>
            <input class="w-full rounded-lg px-3 py-2 bg-white/10 border border-white/10" type="date" v-model="metadata.endDate" />
            <small class="text-red-400 text-xs" v-if="errors.endDate">{{ errors.endDate }}</small>
          </label>
        </div>

        <button class="px-4 py-2 rounded-full bg-gradient-to-r from-brand to-brand-secondary text-slate-900 self-start mt-2" @click="saveMetadata">Lưu metadata</button>
        <p class="text-emerald-400 text-sm" v-if="metadataStatus">{{ metadataStatus }}</p>
      </div>

      <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3" v-if="projectPath">
        <h2>Backlog (.planning)</h2>
        <div class="flex flex-wrap gap-4 text-blue-200 text-sm">
          <span>Epics: {{ planningTotals.epic }}</span>
          <span>Stories: {{ planningTotals.story }}</span>
          <span>Tasks: {{ planningTotals.task }}</span>
          <span>Tổng: {{ planningTotals.all }}</span>
        </div>

        <p v-if="planningItems.length === 0" class="text-zinc-400 text-sm">Chưa tìm thấy file backlog trong .planning.</p>

        <table v-else class="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th class="text-left font-semibold text-zinc-400 pb-2">Loại</th>
              <th class="text-left font-semibold text-zinc-400 pb-2">ID</th>
              <th class="text-left font-semibold text-zinc-400 pb-2">Tiêu đề</th>
              <th class="text-left font-semibold text-zinc-400 pb-2">Trạng thái</th>
              <th class="text-left font-semibold text-zinc-400 pb-2">Priority</th>
              <th class="text-left font-semibold text-zinc-400 pb-2">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-t border-white/5" v-for="item in planningItems" :key="item.path">
              <td><span class="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 capitalize text-xs">{{ item.type }}</span></td>
              <td>{{ item.id }}</td>
              <td class="max-w-[320px] truncate">{{ item.title }}</td>
              <td>{{ item.status || '—' }}</td>
              <td>{{ item.priority || '—' }}</td>
              <td>{{ item.points ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10" v-if="projectPath">
        <h2 class="mb-3">Boards (Stories)</h2>
        <div class="grid md:grid-cols-3 gap-4">
          <div
            class="rounded-lg border border-white/10 p-3 min-h-[240px] transition-colors"
            @dragover.prevent
            @drop="onDrop('todo', $event)"
          >
            <h3 class="text-sm text-zinc-400 mb-2">Todo <span class="ml-1 text-xs text-zinc-500">({{ storiesByStatus.todo.length }})</span></h3>
            <div class="space-y-2">
              <div
                v-for="s in storiesByStatus.todo"
                :key="s.path"
                class="rounded bg-white/5 border border-white/10 p-2 cursor-grab focus:outline-none focus:ring-2 focus:ring-brand-secondary/60 hover:bg-white/10"
                draggable="true"
                @dragstart="onDragStart(s)"
                tabindex="0"
                @keydown.left.prevent="keyboardMove(s, 'left')"
                @keydown.right.prevent="keyboardMove(s, 'right')"
              >
                <div class="text-sm font-medium truncate">{{ s.title }}</div>
                <div class="text-xs text-zinc-400">{{ s.id }}</div>
                <div class="mt-2 flex items-center gap-2 text-xs">
                  <label class="text-zinc-500">Priority</label>
                  <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                          :value="s.priority || ''"
                          @change="e => inlineSetPriority(s, (e.target as HTMLSelectElement).value)">
                    <option value="">-</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <label class="ml-2 text-zinc-500">Status</label>
                  <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                          :value="s.status || 'todo'"
                          @change="e => inlineSetStatus(s, (e.target as HTMLSelectElement).value as any)">
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            class="rounded-lg border border-white/10 p-3 min-h-[240px] transition-colors"
            @dragover.prevent
            @drop="onDrop('in_progress', $event)"
          >
            <h3 class="text-sm text-zinc-400 mb-2">In Progress <span class="ml-1 text-xs text-zinc-500">({{ storiesByStatus.in_progress.length }})</span></h3>
            <div class="space-y-2">
              <div
                v-for="s in storiesByStatus.in_progress"
                :key="s.path"
                class="rounded bg-white/5 border border-white/10 p-2 cursor-grab focus:outline-none focus:ring-2 focus:ring-brand-secondary/60 hover:bg-white/10"
                draggable="true"
                @dragstart="onDragStart(s)"
                tabindex="0"
                @keydown.left.prevent="keyboardMove(s, 'left')"
                @keydown.right.prevent="keyboardMove(s, 'right')"
              >
                <div class="text-sm font-medium truncate">{{ s.title }}</div>
                <div class="text-xs text-zinc-400">{{ s.id }}</div>
                <div class="mt-2 flex items-center gap-2 text-xs">
                  <label class="text-zinc-500">Priority</label>
                  <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                          :value="s.priority || ''"
                          @change="e => inlineSetPriority(s, (e.target as HTMLSelectElement).value)">
                    <option value="">-</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <label class="ml-2 text-zinc-500">Status</label>
                  <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                          :value="s.status || 'in_progress'"
                          @change="e => inlineSetStatus(s, (e.target as HTMLSelectElement).value as any)">
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            class="rounded-lg border border-white/10 p-3 min-h-[240px] transition-colors"
            @dragover.prevent
            @drop="onDrop('done', $event)"
          >
            <h3 class="text-sm text-zinc-400 mb-2">Done <span class="ml-1 text-xs text-zinc-500">({{ storiesByStatus.done.length }})</span></h3>
            <div class="space-y-2">
              <div
                v-for="s in storiesByStatus.done"
                :key="s.path"
                class="rounded bg-white/5 border border-white/10 p-2 cursor-grab focus:outline-none focus:ring-2 focus:ring-brand-secondary/60 hover:bg-white/10"
                draggable="true"
                @dragstart="onDragStart(s)"
                tabindex="0"
                @keydown.left.prevent="keyboardMove(s, 'left')"
                @keydown.right.prevent="keyboardMove(s, 'right')"
              >
                <div class="text-sm font-medium truncate">{{ s.title }}</div>
                <div class="text-xs text-zinc-400">{{ s.id }}</div>
                <div class="mt-2 flex items-center gap-2 text-xs">
                  <label class="text-zinc-500">Priority</label>
                  <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                          :value="s.priority || ''"
                          @change="e => inlineSetPriority(s, (e.target as HTMLSelectElement).value)">
                    <option value="">-</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <label class="ml-2 text-zinc-500">Status</label>
                  <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                          :value="s.status || 'done'"
                          @change="e => inlineSetStatus(s, (e.target as HTMLSelectElement).value as any)">
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="text-emerald-400 text-sm mt-2" v-if="boardStatus">{{ boardStatus }}</p>
      </div>

      <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3" v-if="projectPath">
        <h2>Backup & Restore</h2>
        <div class="flex gap-2">
          <button class="px-4 py-2 rounded-full bg-white/10" @click="createBackup">Tạo backup</button>
          <button class="px-4 py-2 rounded-full bg-white/10" @click="loadBackups">Tải danh sách</button>
        </div>
        <ul class="list-none p-0" v-if="backups.length > 0">
          <li class="flex items-center justify-between py-1" v-for="b in backups" :key="b.id">
            <span>{{ new Date(b.createdAt).toLocaleString() }}</span>
            <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="restoreBackup(b.id)">Khôi phục</button>
          </li>
        </ul>
        <p v-else class="text-zinc-400 text-sm">Chưa có backup nào.</p>
        <p class="text-brand text-sm" v-if="backupStatus">{{ backupStatus }}</p>
      </div>

      <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3" v-if="projectPath">
        <h2>Export / Import</h2>
        <div class="flex gap-2">
          <button class="px-4 py-2 rounded-full bg-white/10" @click="exportJson" aria-label="Export planning to JSON">Export JSON</button>
          <button class="px-4 py-2 rounded-full bg-white/10" @click="importJson" aria-label="Import planning from JSON">Import JSON</button>
        </div>
        <p class="text-emerald-400 text-sm" v-if="exportStatus">{{ exportStatus }}</p>
      </div>

      <div class="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col gap-3">
        <h2>Activity gần đây</h2>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" :checked="activityEnabled" @change="toggleActivity($event)" />
            <span>Bật Activity Log (tùy chọn)</span>
          </label>
          <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="loadActivity">Tải danh sách</button>
        </div>
        <ul class="list-none p-0 text-sm">
          <li v-for="a in activities" :key="a.id" class="border-t border-white/5 py-1">
            <span class="text-zinc-400 mr-2">{{ new Date(a.createdAt).toLocaleString() }}</span>
            <span class="font-medium">{{ a.type }}</span>
            <code class="ml-2 px-2 py-0.5 rounded bg-white/5">{{ formatPayload(a.payload) }}</code>
          </li>
        </ul>
      </div>
      </section>
      <RouterView />
    </main>
    <Toast v-if="toast.message" :type="toast.type" :message="toast.message" :title="toast.title" :duration="toast.duration" @hidden="toast.message = ''" />
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import Toast from './components/Toast.vue'
import type { PlanningIndexResult, PlanningItem } from '../../shared/planning/types'

const pingValue = ref('...')
const version = ref('...')
const themeLabel = ref('Dark mode')
const projectPath = ref<string | null>(null)
const planningPath = ref<string | null>(null)
const planningCreated = ref(false)
const readmeCreated = ref(false)
const readme = ref('')
const status = ref('')
const metadataStatus = ref('')
const planningItems = ref<PlanningItem[]>([])
const planningTotals = reactive({ epic: 0, story: 0, task: 0, all: 0 })
const backups = ref<Array<{ id: string; createdAt: number }>>([])
const backupStatus = ref('')
const boardStatus = ref('')
const draggingPath = ref<string | null>(null)
const exportStatus = ref('')
const activityEnabled = ref(false)
const activities = ref<Array<{ id: number; type: string; payload: unknown; createdAt: number }>>([])
const toast = reactive<{ type?: 'success' | 'error' | 'info'; title?: string; message: string; duration?: number }>({ message: '' })
let offWatchError: (() => void) | undefined
let offWatchRecovered: (() => void) | undefined

const storiesByStatus = reactive<{ todo: PlanningItem[]; in_progress: PlanningItem[]; done: PlanningItem[] }>({
  todo: [],
  in_progress: [],
  done: []
})

const metadata = reactive({
  name: '',
  description: '',
  teamInput: '',
  startDate: '',
  endDate: ''
})

const errors = reactive<Record<string, string>>({})
let unsubscribePlanning: (() => void) | null = null
const router = useRouter()

const applyPlanningIndex = (payload: PlanningIndexResult) => {
  planningItems.value = payload.items
  Object.assign(planningTotals, payload.totals)
  const stories = planningItems.value.filter((i) => i.type === 'story')
  storiesByStatus.todo = stories.filter((s) => (s.status ?? 'todo') === 'todo')
  storiesByStatus.in_progress = stories.filter((s) => s.status === 'in_progress')
  storiesByStatus.done = stories.filter((s) => s.status === 'done')
}

onMounted(async () => {
  pingValue.value = window.localflow?.ping() ?? 'unavailable'
  version.value = (await window.localflow?.getVersion?.()) ?? 'n/a'

  unsubscribePlanning = window.localflow.onPlanningIndexUpdated(applyPlanningIndex)
  // Watcher error/recovery notifications via preload-exposed helpers
  offWatchError = window.localflow.onWatchError?.((payload) => {
    toast.type = 'error'; toast.message = 'Watcher lỗi: ' + (payload?.message || '')
  })
  offWatchRecovered = window.localflow.onWatchRecovered?.(() => {
    toast.type = 'success'; toast.message = 'Watcher đã khôi phục'
  })

  // Load theme preference
  const { value } = await window.localflow.getSetting({ key: 'theme' })
  const pref = value === 'light' ? 'light' : 'dark'
  applyTheme(pref)

  const { value: act } = await window.localflow.getSetting({ key: 'activityEnabled' })
  activityEnabled.value = act === 'true'

  // Keyboard shortcuts (dev/prod internal)
  const onKey = (e: KeyboardEvent) => {
    // Skip form fields
    const tag = (e.target as HTMLElement)?.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable) return
    const ctrl = e.ctrlKey || e.metaKey
    if (!ctrl) return
    // Navigation: Ctrl+1..4
    if (e.key === '1') { e.preventDefault(); router.push('/') }
    else if (e.key === '2') { e.preventDefault(); router.push('/backlog') }
    else if (e.key === '3') { e.preventDefault(); router.push('/boards') }
    else if (e.key === '4') { e.preventDefault(); router.push('/settings') }
    // Actions: Ctrl+Shift+B backup, Ctrl+Shift+E export
    else if (e.shiftKey && (e.key.toLowerCase() === 'b')) { e.preventDefault(); createBackup() }
    else if (e.shiftKey && (e.key.toLowerCase() === 'e')) { e.preventDefault(); exportJson() }
  }
  window.addEventListener('keydown', onKey)
  // Remove on unmount
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})

onBeforeUnmount(() => {
  unsubscribePlanning?.()
  offWatchError?.()
  offWatchRecovered?.()
})

const resetMetadata = () => {
  metadata.name = ''
  metadata.description = ''
  metadata.teamInput = ''
  metadata.startDate = ''
  metadata.endDate = ''
  metadataStatus.value = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const resetPlanningIndex = () => {
  planningItems.value = []
  planningTotals.epic = 0
  planningTotals.story = 0
  planningTotals.task = 0
  planningTotals.all = 0
}

const applyMetadata = (data: {
  name: string
  description: string
  team: string[]
  startDate: string
  endDate: string
}) => {
  metadata.name = data.name
  metadata.description = data.description
  metadata.teamInput = data.team.join(', ')
  metadata.startDate = data.startDate
  metadata.endDate = data.endDate
}

const loadReadme = async () => {
  if (!projectPath.value) return
  const { content } = await window.localflow.readPlanningReadme({ projectPath: projectPath.value })
  readme.value = content
  status.value = 'Đã load README'
}

const loadMetadata = async () => {
  if (!projectPath.value) return
  const data = await window.localflow.getProjectMetadata({ projectPath: projectPath.value })
  applyMetadata(data)
}

const loadPlanningIndex = async () => {
  if (!projectPath.value) return
  const result = await window.localflow.getPlanningIndex({ projectPath: projectPath.value })
  applyPlanningIndex(result)
}

const loadBackups = async () => {
  if (!projectPath.value) return
  const result = await window.localflow.listBackups({ projectPath: projectPath.value })
  backups.value = result.entries
}

const createBackup = async () => {
  if (!projectPath.value) return
  const res = await window.localflow.createBackup({ projectPath: projectPath.value })
  backupStatus.value = `Đã tạo backup ${res.id}`
  await loadBackups()
}

const restoreBackup = async (id: string) => {
  if (!projectPath.value) return
  const res = await window.localflow.restoreBackup({ projectPath: projectPath.value, id })
  backupStatus.value = res.success ? 'Khôi phục thành công' : 'Khôi phục thất bại'
  await loadPlanningIndex()
}

const validateMetadata = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  if (!metadata.name.trim()) {
    errors.name = 'Tên dự án bắt buộc'
    isValid = false
  }

  if (!metadata.description.trim()) {
    errors.description = 'Mô tả bắt buộc'
    isValid = false
  }

  if (!metadata.startDate) {
    errors.startDate = 'Chọn ngày bắt đầu'
    isValid = false
  }

  if (!metadata.endDate) {
    errors.endDate = 'Chọn ngày kết thúc'
    isValid = false
  }

  if (metadata.startDate && metadata.endDate && metadata.startDate > metadata.endDate) {
    errors.endDate = 'Ngày kết thúc phải sau ngày bắt đầu'
    isValid = false
  }

  return isValid
}

const handleSelect = async () => {
  try {
    const result = await window.localflow.selectProjectRoot()
  projectPath.value = result.path
  planningPath.value = result.planningPath
  planningCreated.value = result.planningCreated
  readmeCreated.value = result.readmeCreated

  if (result.path) {
    status.value = 'Thư mục đã sẵn sàng'
    await Promise.all([loadReadme(), loadMetadata(), loadPlanningIndex()])
    toast.type = 'success'; toast.message = 'Đã chọn thư mục dự án'; toast.duration = 2500
  } else {
    status.value = 'Chưa chọn thư mục'
    readme.value = ''
    resetMetadata()
    resetPlanningIndex()
    toast.type = 'info'; toast.message = 'Chưa chọn thư mục'; toast.duration = 2500
  }
  } catch (e) {
    toast.type = 'error'; toast.message = 'Không thể chọn thư mục'; toast.duration = 3000
  }
}

const saveReadme = async () => {
  if (!projectPath.value) return
  try {
    await window.localflow.writePlanningReadme({ projectPath: projectPath.value, content: readme.value })
    status.value = 'Đã lưu README'
    toast.type = 'success'; toast.message = 'Lưu README thành công'
  } catch {
    toast.type = 'error'; toast.message = 'Lưu README thất bại'
  }
}

const saveMetadata = async () => {
  if (!projectPath.value) return
  if (!validateMetadata()) return

  const team = metadata.teamInput
    .split(',')
    .map((member) => member.trim())
    .filter(Boolean)

  try {
    await window.localflow.saveProjectMetadata({
    projectPath: projectPath.value,
    name: metadata.name.trim(),
    description: metadata.description.trim(),
    team,
    startDate: metadata.startDate,
    endDate: metadata.endDate
  })

  metadataStatus.value = 'Đã lưu metadata'
    toast.type = 'success'; toast.message = 'Đã lưu metadata'
  } catch {
    toast.type = 'error'; toast.message = 'Lưu metadata thất bại'
  }
}

const onDragStart = (item: PlanningItem) => {
  draggingPath.value = item.path
}

const onDrop = async (status: 'todo' | 'in_progress' | 'done', event: DragEvent) => {
  event.preventDefault()
  if (!draggingPath.value) return
  if (status === 'done') {
    const ok = window.confirm('Chuyển sang Done?')
    if (!ok) { draggingPath.value = null; return }
  }
  await window.localflow.updatePlanningStatus({ path: draggingPath.value, status })
  boardStatus.value = `Đã chuyển sang ${status}`
  toast.type = 'success'; toast.message = 'Cập nhật trạng thái thành công'; toast.duration = 2000
  draggingPath.value = null
  await loadPlanningIndex()
}

const nextStatus = (current?: string): 'todo' | 'in_progress' | 'done' => {
  if (current === 'todo') return 'in_progress'
  if (current === 'in_progress') return 'done'
  return 'todo'
}

const prevStatus = (current?: string): 'todo' | 'in_progress' | 'done' => {
  if (current === 'done') return 'in_progress'
  if (current === 'in_progress') return 'todo'
  return 'done'
}

const keyboardMove = async (item: PlanningItem, dir: 'left' | 'right') => {
  const target = dir === 'right' ? nextStatus(item.status) : prevStatus(item.status)
  if (target === 'done') {
    const ok = window.confirm('Chuyển sang Done?')
    if (!ok) return
  }
  await window.localflow.updatePlanningStatus({ path: item.path, status: target })
  boardStatus.value = `Đã chuyển sang ${target}`
  toast.type = 'success'; toast.message = 'Cập nhật trạng thái thành công'; toast.duration = 2000
  await loadPlanningIndex()
}

const inlineSetPriority = async (item: PlanningItem, priority: string) => {
  try {
    await window.localflow.savePlanningItem({ path: item.path, data: { title: item.title, priority } })
    toast.type = 'success'; toast.message = 'Đã cập nhật priority'; toast.duration = 1500
    await loadPlanningIndex()
  } catch {
    toast.type = 'error'; toast.message = 'Cập nhật priority thất bại'
  }
}

const inlineSetStatus = async (item: PlanningItem, status: 'todo' | 'in_progress' | 'done') => {
  try {
    if (status === 'done') {
      const ok = window.confirm('Chuyển sang Done?')
      if (!ok) return
    }
    await window.localflow.updatePlanningStatus({ path: item.path, status })
    toast.type = 'success'; toast.message = 'Đã cập nhật status'; toast.duration = 1500
    await loadPlanningIndex()
  } catch {
    toast.type = 'error'; toast.message = 'Cập nhật status thất bại'
  }
}

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
  applyTheme(next as 'dark' | 'light')
  await window.localflow.setSetting({ key: 'theme', value: next })
}

const loadActivity = async () => {
  const res = await window.localflow.listActivity({ limit: 20 })
  activities.value = res.entries
}

const toggleActivity = async (e: Event) => {
  const checked = (e.target as HTMLInputElement).checked
  activityEnabled.value = checked
  await window.localflow.setSetting({ key: 'activityEnabled', value: checked ? 'true' : 'false' })
}

const formatPayload = (p: unknown) => {
  try { return JSON.stringify(p) } catch { return String(p) }
}

const exportJson = async () => {
  if (!projectPath.value) return
  const res = await window.localflow.exportPlanningJson({ projectPath: projectPath.value })
  exportStatus.value = res.success ? `Đã export: ${res.path}` : 'Đã huỷ'
  toast.type = res.success ? 'success' : 'info'
  toast.message = res.success ? 'Export JSON thành công' : 'Đã huỷ export'
}

const importJson = async () => {
  if (!projectPath.value) return
  const res = await window.localflow.importPlanningJson({ projectPath: projectPath.value })
  if (res.success) {
    const conflicts = (res.conflicts?.length ?? 0)
    const errors = (res.errors?.length ?? 0)
    exportStatus.value = `Import: ${res.created} mục. Conflicts: ${conflicts}. Errors: ${errors}.`
    toast.type = 'success'; toast.message = 'Import JSON hoàn tất'; toast.duration = 2500
  } else {
    exportStatus.value = 'Đã huỷ'
    toast.type = 'info'; toast.message = 'Đã huỷ import'
  }
  await loadPlanningIndex()
}
</script>

<style scoped>
/* migrated most styles to Tailwind utility classes */
</style>
