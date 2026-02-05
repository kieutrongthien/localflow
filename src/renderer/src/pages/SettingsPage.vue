<template>
  <div class="space-y-4">
    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Giao diện</h3>
      <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="toggleTheme" aria-label="Toggle theme">{{ themeLabel }}</button>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Activity Log</h3>
      <label class="flex items-center gap-2 text-sm">
        <input type="checkbox" :checked="activityEnabled" @change="toggleActivity($event)" aria-label="Enable activity log" />
        <span>Bật Activity Log (tùy chọn)</span>
      </label>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Indexer</h3>
      <label class="block text-sm mb-1">Exclude patterns (csv)</label>
      <input class="w-full rounded px-3 py-2 bg-white/10 border border-white/10" v-model="excludes" placeholder="*.tmp, .DS_Store" aria-label="Indexer exclude patterns" />
      <button class="mt-2 px-3 py-1 rounded bg-white/10 text-sm" @click="saveExcludes" aria-label="Save index excludes">Lưu</button>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Database</h3>
      <p class="text-sm text-zinc-400">Path: {{ dbPath }}</p>
  </div>

  <div class="rounded-xl border border-white/10 bg-white/5 p-4">
    <h3 class="mb-2">Cập nhật nội bộ</h3>
      <label class="block text-sm mb-1">Đường dẫn feed JSON</label>
      <input class="w-full rounded px-3 py-2 bg-white/10 border border-white/10" v-model="updateFeedPath" placeholder="/path/to/update.json" aria-label="Update feed JSON path" />
      <div class="mt-2 flex items-center gap-2">
        <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="saveUpdateFeed" aria-label="Save update feed path">Lưu</button>
        <button class="px-3 py-1 rounded bg-white/10 text-sm" @click="checkUpdate" aria-label="Check for updates">Kiểm tra</button>
        <span class="text-sm" v-if="updateStatus">{{ updateStatus }}</span>
      </div>
    </div>
  </div>

  <div class="rounded-xl border border-white/10 bg-white/5 p-4">
    <h3 class="mb-2">Backup</h3>
    <label class="block text-sm mb-1">Backup directory (absolute)</label>
    <input class="w-full rounded px-3 py-2 bg-white/10 border border-white/10" v-model="backupDirPath" placeholder="/path/to/backups" aria-label="Backup directory path" />
    <button class="mt-2 px-3 py-1 rounded bg-white/10 text-sm" @click="saveBackupDir" aria-label="Save backup directory">Lưu</button>
    <p class="mt-2 text-xs text-zinc-500">Nếu trống, ứng dụng dùng mặc định: {project}/.localflow_backups</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const themeLabel = ref('Dark mode')
const activityEnabled = ref(false)
const excludes = ref('')
const dbPath = ref('')
const updateFeedPath = ref('')
const updateStatus = ref('')
const backupDirPath = ref('')

onMounted(async () => {
  const batch = await window.localflow.getSettings({ keys: ['theme', 'activityEnabled', 'indexExcludes', 'updateFeedPath', 'backupDirPath'] })
  applyTheme(batch.values.theme === 'light' ? 'light' : 'dark')
  activityEnabled.value = (batch.values.activityEnabled || '') === 'true'
  excludes.value = batch.values.indexExcludes || ''
  updateFeedPath.value = batch.values.updateFeedPath || ''
  backupDirPath.value = batch.values.backupDirPath || ''

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

const saveUpdateFeed = async () => {
  await window.localflow.setSetting({ key: 'updateFeedPath', value: updateFeedPath.value })
}

const checkUpdate = async () => {
  const res = await window.localflow.checkUpdate({ feedPath: updateFeedPath.value || undefined })
  updateStatus.value = res.error ? 'Feed lỗi' : (res.hasUpdate ? `Có bản mới: ${res.latestVersion}` : 'Đang ở bản mới nhất')
}

const saveBackupDir = async () => {
  await window.localflow.setSetting({ key: 'backupDirPath', value: backupDirPath.value })
}
</script>
