<template>
  <main class="app-shell">
    <section>
      <img src="./assets/logo.svg" alt="LocalFlow logo" class="logo" />
      <h1>LocalFlow</h1>
      <p>Local-first backlog planner. Electron + Vue scaffold đang sẵn sàng.</p>
      <code>Ping từ preload: {{ pingValue }}</code>
      <code>Version: {{ version }}</code>

      <div class="card">
        <h2>Thao tác README</h2>
        <button @click="handleSelect">Chọn thư mục dự án</button>
        <p v-if="projectPath">Đã chọn: {{ projectPath }}</p>
        <p v-if="planningPath">.planning: {{ planningPath }}</p>

        <ul class="status-list" v-if="projectPath">
          <li>Planning {{ planningCreated ? 'đã tạo' : 'tồn tại sẵn' }}</li>
          <li>README {{ readmeCreated ? 'vừa tạo mới' : 'sẵn sàng' }}</li>
        </ul>

        <div class="stack" v-if="projectPath">
          <button @click="loadReadme">Đọc README.md</button>
          <button @click="saveReadme">Lưu README.md</button>
        </div>

        <textarea v-model="readme" rows="6" :disabled="!projectPath" placeholder="# README.md" />
        <p class="status" v-if="status">{{ status }}</p>
      </div>

      <div class="card" v-if="projectPath">
        <h2>Metadata dự án</h2>
        <div class="form-grid">
          <label>
            <span>Tên dự án *</span>
            <input class="input" type="text" v-model="metadata.name" placeholder="LocalFlow" />
            <small class="error" v-if="errors.name">{{ errors.name }}</small>
          </label>

          <label>
            <span>Mô tả *</span>
            <textarea class="input" rows="3" v-model="metadata.description" placeholder="Mô tả dự án" />
            <small class="error" v-if="errors.description">{{ errors.description }}</small>
          </label>

          <label>
            <span>Team (nhập tên, cách nhau bằng dấu phẩy)</span>
            <input class="input" type="text" v-model="metadata.teamInput" placeholder="Bieber, Colin" />
          </label>

          <label>
            <span>Ngày bắt đầu *</span>
            <input class="input" type="date" v-model="metadata.startDate" />
            <small class="error" v-if="errors.startDate">{{ errors.startDate }}</small>
          </label>

          <label>
            <span>Ngày kết thúc *</span>
            <input class="input" type="date" v-model="metadata.endDate" />
            <small class="error" v-if="errors.endDate">{{ errors.endDate }}</small>
          </label>
        </div>

        <button class="primary" @click="saveMetadata">Lưu metadata</button>
        <p class="status" v-if="metadataStatus">{{ metadataStatus }}</p>
      </div>

      <div class="card" v-if="projectPath">
        <h2>Backlog (.planning)</h2>
        <div class="totals-row">
          <span>Epics: {{ planningTotals.epic }}</span>
          <span>Stories: {{ planningTotals.story }}</span>
          <span>Tasks: {{ planningTotals.task }}</span>
          <span>Tổng: {{ planningTotals.all }}</span>
        </div>

        <p v-if="planningItems.length === 0" class="muted">Chưa tìm thấy file backlog trong .planning.</p>

        <table v-else class="backlog-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Trạng thái</th>
              <th>Priority</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in planningItems" :key="item.path">
              <td><span class="badge">{{ item.type }}</span></td>
              <td>{{ item.id }}</td>
              <td class="title">{{ item.title }}</td>
              <td>{{ item.status || '—' }}</td>
              <td>{{ item.priority || '—' }}</td>
              <td>{{ item.points ?? '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { PlanningItem } from '../../shared/planning/types'

const pingValue = ref('...')
const version = ref('...')
const projectPath = ref<string | null>(null)
const planningPath = ref<string | null>(null)
const planningCreated = ref(false)
const readmeCreated = ref(false)
const readme = ref('')
const status = ref('')
const metadataStatus = ref('')
const planningItems = ref<PlanningItem[]>([])
const planningTotals = reactive({ epic: 0, story: 0, task: 0, all: 0 })

const metadata = reactive({
  name: '',
  description: '',
  teamInput: '',
  startDate: '',
  endDate: ''
})

const errors = reactive<Record<string, string>>({})

onMounted(async () => {
  pingValue.value = window.localflow?.ping() ?? 'unavailable'
  version.value = (await window.localflow?.getVersion?.()) ?? 'n/a'
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
  planningItems.value = result.items
  Object.assign(planningTotals, result.totals)
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
  const result = await window.localflow.selectProjectRoot()
  projectPath.value = result.path
  planningPath.value = result.planningPath
  planningCreated.value = result.planningCreated
  readmeCreated.value = result.readmeCreated

  if (result.path) {
    status.value = 'Thư mục đã sẵn sàng'
    await Promise.all([loadReadme(), loadMetadata(), loadPlanningIndex()])
  } else {
    status.value = 'Chưa chọn thư mục'
    readme.value = ''
    resetMetadata()
    resetPlanningIndex()
  }
}

const saveReadme = async () => {
  if (!projectPath.value) return
  await window.localflow.writePlanningReadme({ projectPath: projectPath.value, content: readme.value })
  status.value = 'Đã lưu README'
}

const saveMetadata = async () => {
  if (!projectPath.value) return
  if (!validateMetadata()) return

  const team = metadata.teamInput
    .split(',')
    .map((member) => member.trim())
    .filter(Boolean)

  await window.localflow.saveProjectMetadata({
    projectPath: projectPath.value,
    name: metadata.name.trim(),
    description: metadata.description.trim(),
    team,
    startDate: metadata.startDate,
    endDate: metadata.endDate
  })

  metadataStatus.value = 'Đã lưu metadata'
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #1a1a1a, #0d0d0d);
  color: #f5f5f5;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 3rem 1rem;
}

section {
  width: min(960px, 100%);
  text-align: left;
  padding: 2.5rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
}

section > h1,
section > p,
section > code {
  text-align: center;
}

.logo {
  display: block;
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
}

code {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  font-family: 'JetBrains Mono', 'SFMono-Regular', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.card {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  background: linear-gradient(120deg, #34d399, #22d3ee);
  color: #0f172a;
  font-weight: 600;
}

button.primary {
  align-self: flex-start;
  margin-top: 0.5rem;
}

textarea,
input.input,
textarea.input {
  width: 100%;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  border: none;
  min-height: 48px;
  font-size: 1rem;
  font-family: 'Inter', system-ui, sans-serif;
}

textarea {
  min-height: 120px;
  font-family: 'JetBrains Mono', monospace;
}

.stack {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.status {
  color: #34d399;
  font-size: 0.9rem;
}

.status-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.85rem;
  color: #a3a3a3;
}

.totals-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.9rem;
  color: #cbd5f5;
}

.muted {
  color: #9ca3af;
  font-size: 0.9rem;
}

.backlog-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.backlog-table th,
.backlog-table td {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.backlog-table th {
  text-align: left;
  font-weight: 600;
  color: #9ca3af;
}

.backlog-table .title {
  max-width: 320px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(52, 211, 153, 0.2);
  color: #34d399;
  text-transform: capitalize;
  font-size: 0.8rem;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.95rem;
}

.error {
  color: #f87171;
  font-size: 0.8rem;
}

@media (min-width: 768px) {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .form-grid label:nth-child(2) {
    grid-column: span 2;
  }

  .form-grid label:nth-child(3) {
    grid-column: span 2;
  }
}
</style>
