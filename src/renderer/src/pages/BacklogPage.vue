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
            <td class="px-4 py-2">{{ it.status || '-' }}</td>
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

const items = ref<Array<{ type: string; title: string; status?: string; filename: string; path: string }>>([])
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
</script>
