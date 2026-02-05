<template>
  <div class="space-y-4">
    <h2 class="text-lg font-semibold">Epic Editor</h2>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <div class="grid md:grid-cols-2 gap-3 mb-3">
        <div>
          <label class="block text-sm mb-1">Select Epic</label>
          <select v-model="selectedPath" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10">
            <option value="">(choose epic)</option>
            <option v-for="e in epics" :key="e.path" :value="e.path">{{ e.title }}</option>
          </select>
        </div>
        <div class="flex items-end">
          <button class="px-3 py-2 rounded bg-white/10" @click="loadSelected">Load</button>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1">Title</label>
          <input v-model="form.title" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" />
        </div>
        <div>
          <label class="block text-sm mb-1">Status</label>
          <select v-model="form.status" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10">
            <option value="">-</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-3 mt-3">
        <div>
          <label class="block text-sm mb-1">Priority</label>
          <select v-model="form.priority" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10">
            <option value="">-</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">Tags (CSV)</label>
          <input v-model="tagsCsv" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" />
        </div>
      </div>

      <div class="mt-4">
        <button class="px-4 py-2 rounded bg-brand-secondary/20 hover:bg-brand-secondary/30" @click="save">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import matter from 'gray-matter'

const epics = ref<Array<{ title: string; filename: string; path: string }>>([])
const selectedPath = ref('')
const projectPath = ref('')
const form = ref<{ title: string; status?: string; priority?: string; tags?: string[] }>({ title: '' })
const tagsCsv = ref('')

onMounted(async () => {
  const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  if (!p) return
  projectPath.value = p
  const idx = await window.localflow.getPlanningIndex({ projectPath: p })
  epics.value = idx.items.filter((i) => i.type === 'epic').map((i) => ({ title: i.title, filename: i.filename, path: i.path }))
})

const loadSelected = async () => {
  if (!selectedPath.value) return
  const res = await window.localflow.readPlanningFile({ path: selectedPath.value })
  const parsed = matter(res.content || '')
  const d: any = parsed.data || {}
  form.value = {
    title: d.title || '',
    status: d.status || 'todo',
    priority: d.priority || '',
    tags: Array.isArray(d.tags) ? d.tags : []
  }
  tagsCsv.value = (form.value.tags || []).join(', ')
}

watch(tagsCsv, (v) => {
  form.value.tags = (v || '')
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
})

const save = async () => {
  if (!selectedPath.value) return
  await window.localflow.savePlanningItem({ path: selectedPath.value, data: { title: form.value.title, status: form.value.status, priority: form.value.priority, tags: form.value.tags } })
}
</script>
