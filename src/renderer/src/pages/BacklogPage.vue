<template>
  <div class="space-y-4">
    <div class="flex gap-2 items-center">
      <input v-model="filters.query" placeholder="Search..." aria-label="Search backlog" class="px-3 py-2 rounded-md w-64 bg-white text-zinc-900 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-white/10 dark:text-white dark:border-white/10" />
      <select v-model="filters.status" aria-label="Filter by status" class="px-3 py-2 rounded-md bg-white text-zinc-900 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 dark:bg-white/10 dark:text-white dark:border-white/10">
        <option value="">All status</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <UIButton variant="secondary" @click="reload" aria-label="Reload backlog">Reload</UIButton>
      <span class="text-sm text-zinc-400 ml-auto">{{ items.length }} items</span>
    </div>

    <UICard class="overflow-hidden shadow-sm">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-white/5 sticky top-0 z-10">
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
              <RouterLink :to="`/detail?path=${encodeURIComponent(it.path)}`" class="underline hover:opacity-80" :aria-label="`Open detail for ${it.title}`">{{ it.title }}</RouterLink>
            </td>
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <UIPill color="blue">{{ it.status || '-' }}</UIPill>
                <select class="px-2 py-1 rounded-full bg-white text-zinc-900 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-white dark:border-white/10" aria-label="Inline edit status"
                      :value="it.status || ''"
                      @change="e => inlineSetStatus(it, (e.target as HTMLSelectElement).value as any)">
                 <option value="">-</option>
                 <option value="todo">Todo</option>
                 <option value="in_progress">In Progress</option>
                 <option value="done">Done</option>
               </select>
              </div>
            </td>
            <td class="px-4 py-2">
              <div class="flex items-center gap-2">
                <UIPill color="blue">{{ it.priority || '-' }}</UIPill>
                <select class="px-2 py-1 rounded-full bg-white text-zinc-900 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-white dark:border-white/10" aria-label="Inline edit priority"
                      :value="it.priority || ''"
                      @change="e => inlineSetPriority(it, (e.target as HTMLSelectElement).value)">
                 <option value="">-</option>
                 <option value="Low">Low</option>
                 <option value="Medium">Medium</option>
                 <option value="High">High</option>
               </select>
              </div>
            </td>
            <td class="px-4 py-2">
              <input type="number" class="w-20 px-2 py-1 rounded-md bg-white text-zinc-900 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 dark:bg-white/10 dark:text-white dark:border-white/10" aria-label="Inline edit points"
                     :value="it.points ?? ''"
                     @change="e => inlineSetPoints(it, (e.target as HTMLInputElement).value)" />
            </td>
            <td class="px-4 py-2">{{ it.assignee || '-' }}</td>
            <td class="px-4 py-2 text-zinc-400">{{ it.filename }}</td>
          </tr>
          <tr v-if="filtered.length === 0">
            <td colspan="7" class="px-4 py-6">
              <UIEmptyState>No items</UIEmptyState>
            </td>
          </tr>
        </tbody>
      </table>
    </UICard>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, computed } from 'vue'
import UIButton from '../components/UI/Button.vue'
import UICard from '../components/UI/Card.vue'
import UIPill from '../components/UI/Pill.vue'
import UIEmptyState from '../components/UI/EmptyState.vue'
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
