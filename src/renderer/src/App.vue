<template>
  <main class="app-shell">
    <section>
      <img src="./assets/logo.svg" alt="LocalFlow logo" class="logo" />
      <h1>LocalFlow</h1>
      <p>Local-first backlog planner. Electron + Vue scaffold đang sẵn sàng.</p>
      <code>Ping từ preload: {{ pingValue }}</code>
      <code>Version: {{ version }}</code>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const pingValue = ref('...')
const version = ref('...')

onMounted(async () => {
  pingValue.value = window.localflow?.ping() ?? 'unavailable'
  version.value = (await window.localflow?.getVersion?.()) ?? 'n/a'
})
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
</style>
