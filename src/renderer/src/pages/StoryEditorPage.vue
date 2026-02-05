<template>
  <div class="space-y-4">
    <div class="flex gap-2 items-end">
      <label class="block text-sm">Story</label>
      <select v-model="selectedPath" class="px-3 py-2 rounded bg-white/10 border border-white/10 min-w-[280px]">
        <option value="">Select a story...</option>
        <option v-for="s in stories" :key="s.path" :value="s.path">{{ s.title }} ({{ s.filename }})</option>
      </select>
      <button class="px-3 py-2 rounded bg-white/10" @click="loadSelected">Load</button>
      <span v-if="status" class="text-sm text-zinc-400 ml-2">{{ status }}</span>
    </div>

    <div v-if="formVisible" class="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
      <div>
        <label class="block text-sm mb-1">Title</label>
        <input v-model="form.title" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" />
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1">Status</label>
          <select v-model="form.status" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10">
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
        <div>
          <label class="block text-sm mb-1">Priority</label>
          <input v-model="form.priority" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" />
        </div>
      </div>
      <div>
        <label class="block text-sm mb-1">Parent Epic</label>
        <select v-model="form.parentEpicPath" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10">
          <option value="">None</option>
          <option v-for="e in epics" :key="e.path" :value="e.path">{{ e.title }} ({{ e.filename }})</option>
        </select>
      </div>
      <div class="grid md:grid-cols-2 gap-3">
        <div>
          <label class="block text-sm mb-1">Points</label>
          <input type="number" v-model.number="form.points" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" />
        </div>
        <div>
          <label class="block text-sm mb-1">Owner</label>
          <input v-model="form.owner" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" />
        </div>
      </div>
      <div>
        <label class="block text-sm mb-1">Tags (CSV)</label>
        <input v-model="tagsCsv" class="w-full px-3 py-2 rounded bg-white/10 border border-white/10" />
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-2 rounded bg-emerald-500 text-slate-900" @click="save">Save</button>
        <button class="px-3 py-2 rounded bg-white/10" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import matter from 'gray-matter'

const projectPath = ref('')
const stories = ref<Array<{ title: string; filename: string; path: string }>>([])
const epics = ref<Array<{ title: string; filename: string; path: string }>>([])
const selectedPath = ref('')
const formVisible = ref(false)
const status = ref('')
const form = ref<{ title: string; status: string; priority: string; points: number | null; owner: string; tags: string[] }>({ title: '', status: 'todo', priority: '', points: null, owner: '', tags: [] })
const tagsCsv = ref('')

onMounted(async () => {
  const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  if (!p) return
  projectPath.value = p
  const idx = await window.localflow.getPlanningIndex({ projectPath: p })
  stories.value = idx.items.filter((i) => i.type === 'story').map((i) => ({ title: i.title, filename: i.filename, path: i.path }))
  epics.value = idx.items.filter((i) => i.type === 'epic').map((i) => ({ title: i.title, filename: i.filename, path: i.path }))
})

const loadSelected = async () => {
  if (!selectedPath.value) return
  const raw = await (await fetch(selectedPath.value)).text().catch(() => '')
  // Fallback: try via index (we don't expose direct fs read in preload; for demo, use title from index)
  try {
    const parsed = matter(raw)
    const d: any = parsed.data || {}
    form.value = {
      title: d.title || '',
      status: d.status || 'todo',
      priority: d.priority || '',
      points: d.points ?? null,
      owner: d.owner || '',
      tags: Array.isArray(d.tags) ? d.tags : [],
      parentEpicPath: d.parentEpicPath || ''
    }
    tagsCsv.value = form.value.tags.join(', ')
  } catch {
    // if read fails, initialize with defaults
    const s = stories.value.find((x) => x.path === selectedPath.value)
    form.value.title = s?.title || ''
    form.value.status = 'todo'
    form.value.priority = ''
    form.value.points = null
    form.value.owner = ''
    tagsCsv.value = ''
  }
  formVisible.value = true
}

const save = async () => {
  form.value.tags = tagsCsv.value.split(',').map((t) => t.trim()).filter(Boolean)
  const res = await window.localflow.savePlanningItem({ path: selectedPath.value, data: form.value })
  status.value = res.success ? 'Saved' : 'Save failed'
  if (res.success) formVisible.value = false
}

const cancel = () => { formVisible.value = false; status.value = '' }
</script>
