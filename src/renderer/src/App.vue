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

        <div class="stack" v-if="projectPath">
          <button @click="loadReadme">Đọc README.md</button>
          <button @click="saveReadme">Lưu README.md</button>
        </div>

        <textarea v-model="readme" rows="6" placeholder="# README.md" />
        <p class="status" v-if="status">{{ status }}</p>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const pingValue = ref('...')
const version = ref('...')
const projectPath = ref<string | null>(null)
const readme = ref('')
const status = ref('')

onMounted(async () => {
  pingValue.value = window.localflow?.ping() ?? 'unavailable'
  version.value = (await window.localflow?.getVersion?.()) ?? 'n/a'
})

const handleSelect = async () => {
  const result = await window.localflow.selectProjectRoot()
  projectPath.value = result.path
  status.value = result.path ? 'Đã chọn thư mục' : 'Chưa chọn thư mục'
}

const loadReadme = async () => {
  if (!projectPath.value) return
  const { content } = await window.localflow.readPlanningReadme({ projectPath: projectPath.value })
  readme.value = content
  status.value = 'Đã load README'
}

const saveReadme = async () => {
  if (!projectPath.value) return
  await window.localflow.writePlanningReadme({ projectPath: projectPath.value, content: readme.value })
  status.value = 'Đã lưu README'
}
</script>

<style scoped>
.app-shell {
  height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #1a1a1a, #0d0d0d);
  color: #f5f5f5;
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

section {
  text-align: center;
  padding: 3rem;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
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

textarea {
  width: 100%;
  border-radius: 12px;
  padding: 1rem;
  border: none;
  min-height: 120px;
  font-family: 'JetBrains Mono', monospace;
}

.stack {
  display: flex;
  gap: 0.5rem;
}

.status {
  color: #34d399;
  font-size: 0.9rem;
}
</style>
