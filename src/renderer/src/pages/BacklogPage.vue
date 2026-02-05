<template>
  <div class="space-y-4">
    <div class="flex gap-2 items-center">
      <input v-model="filters.query" placeholder="Search..." class="px-3 py-2 rounded bg-white/10 border border-white/10 w-64" />
      <select v-model="filters.status" class="px-3 py-2 rounded bg-white/10 border border-white/10">
        <option value="">All status</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button class="px-3 py-2 rounded bg-white/10" @click="reload">Reload</button>
      <span class="text-sm text-zinc-400 ml-auto">{{ items.length }} items</span>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-white/5">
            <th class="text-left px-4 py-2">Type</th>
            <th class="text-left px-4 py-2">Title</th>
            <th class="text-left px-4 py-2">Status</th>
            <th class="text-left px-4 py-2">Priority</th>
            <th class="text-left px-4 py-2">Points</th>
            <th class="text-left px-4 py-2">Assignee</th>
            <th class="text-left px-4 py-2">Filename</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="it in filtered" :key="it.path" class="border-t border-white/10">
            <td class="px-4 py-2 capitalize">{{ it.type }}</td>
            <td class="px-4 py-2">
              <RouterLink :to="`/detail?path=${encodeURIComponent(it.path)}`" class="underline hover:opacity-80">{{ it.title }}</RouterLink>
            </td>
            <td class="px-4 py-2">
              <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                      :value="it.status || ''"
                      @change="e => inlineSetStatus(it, (e.target as HTMLSelectElement).value as any)">
                <option value="">-</option>
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </td>
            <td class="px-4 py-2">
              <select class="px-2 py-1 rounded bg-white/10 border border-white/10"
                      :value="it.priority || ''"
                      @change="e => inlineSetPriority(it, (e.target as HTMLSelectElement).value)">
                <option value="">-</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </td>
            <td class="px-4 py-2">
              <input type="number" class="w-20 px-2 py-1 rounded bg-white/10 border border-white/10"
                     :value="it.points ?? ''"
                     @change="e => inlineSetPoints(it, (e.target as HTMLInputElement).value)" />
            </td>
            <td class="px-4 py-2">{{ it.assignee || '-' }}</td>
            <td class="px-4 py-2 text-zinc-400">{{ it.filename }}</td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="4" class="px-4 py-6 text-center text-zinc-400">No items</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import { applyPlanningFilters } from '../../../shared/planning/filter'

const items = ref<Array<{ type: string; title: string; status?: string; priority?: string; points?: number | null; assignee?: string; filename: string; path: string }>>([])
const projectPath = ref<string>('')
const filters = reactive<{ query: string; status: string }>({ query: '', status: '' })
const filtered = computed(() => applyPlanningFilters(items.value as any, filters as any))

const load = async () => {
  const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  if (!p) return
  projectPath.value = p
  const idx = await window.localflow.getPlanningIndex({ projectPath: p })
  items.value = idx.items
}

const reload = async () => {
  if (projectPath.value) {
    const idx = await window.localflow.getPlanningIndex({ projectPath: projectPath.value })
    items.value = idx.items
  } else {
    await load()
  }
}

onMounted(load)

const inlineSetPriority = async (item: any, priority: string) => {
  try {
    await window.localflow.savePlanningItem({ path: item.path, data: { title: item.title, priority } })
  } catch {}
  await reload()
}

const inlineSetStatus = async (item: any, status: 'todo' | 'in_progress' | 'done' | '') => {
  try {
    if (status === 'done') {
      const ok = window.confirm('Chuyển sang Done?')
      if (!ok) return
    }
    if (status) {
      await window.localflow.updatePlanningStatus({ path: item.path, status })
    } else {
      await window.localflow.savePlanningItem({ path: item.path, data: { title: item.title, status: '' } })
    }
  } catch {}
  await reload()
}

const inlineSetPoints = async (item: any, value: string) => {
  const num = value === '' ? null : Number(value)
  try {
    await window.localflow.savePlanningItem({ path: item.path, data: { title: item.title, points: Number.isFinite(num as number) ? (num as number) : null } })
  } catch {}
  await reload()
}
</script>
