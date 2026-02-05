<template>
  <div class="space-y-4">
    <div class="grid md:grid-cols-3 gap-4">
      <UICard :dark="true" class="p-3 min-h-[280px]" @dragover.prevent @drop="(e:any)=>onDrop('todo', e)">
        <h3 class="text-sm text-zinc-400 mb-2">Todo <span class="ml-1 text-xs text-zinc-500">({{ storiesByStatus.todo.length }})</span></h3>
        <div class="space-y-2">
          <div v-for="s in storiesByStatus.todo" :key="s.path"
               class="rounded bg-white/5 border border-white/10 p-2 cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-white/10 shadow-sm hover:shadow"
               draggable="true" @dragstart="()=>onDragStart(s)" tabindex="0"
               @keydown.left.prevent="keyboardMove(s, 'left')" @keydown.right.prevent="keyboardMove(s, 'right')">
            <div class="text-sm font-medium truncate">{{ s.title }}</div>
            <div class="text-xs text-zinc-400">{{ s.id }}</div>
            <div class="mt-2 flex items-center gap-2 text-xs">
              <label class="text-zinc-500">Priority</label>
              <select class="px-2 py-1 rounded-full bg-white/10 border border-white/10 focus:ring-2 focus:ring-indigo-500"
                      :value="s.priority || ''" @change="e => inlineSetPriority(s, (e.target as HTMLSelectElement).value)">
                <option value="">-</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <label class="ml-2 text-zinc-500">Status</label>
              <select class="px-2 py-1 rounded-full bg-white/10 border border-white/10 focus:ring-2 focus:ring-indigo-500"
                      :value="s.status || 'todo'" @change="e => inlineSetStatus(s, (e.target as HTMLSelectElement).value as any)">
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>
      </UICard>

      <UICard :dark="true" class="p-3 min-h-[280px]" @dragover.prevent @drop="(e:any)=>onDrop('in_progress', e)">
        <h3 class="text-sm text-zinc-400 mb-2">In Progress <span class="ml-1 text-xs text-zinc-500">({{ storiesByStatus.in_progress.length }})</span></h3>
        <div class="space-y-2">
          <div v-for="s in storiesByStatus.in_progress" :key="s.path"
               class="rounded bg-white/5 border border-white/10 p-2 cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-white/10 shadow-sm hover:shadow"
               draggable="true" @dragstart="()=>onDragStart(s)" tabindex="0"
               @keydown.left.prevent="keyboardMove(s, 'left')" @keydown.right.prevent="keyboardMove(s, 'right')">
            <div class="text-sm font-medium truncate">{{ s.title }}</div>
            <div class="text-xs text-zinc-400">{{ s.id }}</div>
            <div class="mt-2 flex items-center gap-2 text-xs">
              <label class="text-zinc-500">Priority</label>
              <select class="px-2 py-1 rounded-full bg-white/10 border border-white/10 focus:ring-2 focus:ring-indigo-500"
                      :value="s.priority || ''" @change="e => inlineSetPriority(s, (e.target as HTMLSelectElement).value)">
                <option value="">-</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <label class="ml-2 text-zinc-500">Status</label>
              <select class="px-2 py-1 rounded-full bg-white/10 border border-white/10 focus:ring-2 focus:ring-indigo-500"
                      :value="s.status || 'in_progress'" @change="e => inlineSetStatus(s, (e.target as HTMLSelectElement).value as any)">
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>
      </UICard>

      <UICard :dark="true" class="p-3 min-h-[280px]" @dragover.prevent @drop="(e:any)=>onDrop('done', e)">
        <h3 class="text-sm text-zinc-400 mb-2">Done <span class="ml-1 text-xs text-zinc-500">({{ storiesByStatus.done.length }})</span></h3>
        <div class="space-y-2">
          <div v-for="s in storiesByStatus.done" :key="s.path"
               class="rounded bg-white/5 border border-white/10 p-2 cursor-grab focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-white/10 shadow-sm hover:shadow"
               draggable="true" @dragstart="()=>onDragStart(s)" tabindex="0"
               @keydown.left.prevent="keyboardMove(s, 'left')" @keydown.right.prevent="keyboardMove(s, 'right')">
            <div class="text-sm font-medium truncate">{{ s.title }}</div>
            <div class="text-xs text-zinc-400">{{ s.id }}</div>
            <div class="mt-2 flex items-center gap-2 text-xs">
              <label class="text-zinc-500">Priority</label>
              <select class="px-2 py-1 rounded-full bg-white/10 border border-white/10 focus:ring-2 focus:ring-indigo-500"
                      :value="s.priority || ''" @change="e => inlineSetPriority(s, (e.target as HTMLSelectElement).value)">
                <option value="">-</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <label class="ml-2 text-zinc-500">Status</label>
              <select class="px-2 py-1 rounded-full bg-white/10 border border-white/10 focus:ring-2 focus:ring-indigo-500"
                      :value="s.status || 'done'" @change="e => inlineSetStatus(s, (e.target as HTMLSelectElement).value as any)">
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>
      </UICard>
    </div>
    <p class="text-emerald-400 text-sm" v-if="boardStatus">{{ boardStatus }}</p>
  </div>
</template>

<script setup lang="ts">
import UICard from '../components/UI/Card.vue'
import type { PlanningItem } from '../../../shared/planning/types'
import { reactive, ref, onMounted } from 'vue'

const boardStatus = ref('')
const planningItems = ref<PlanningItem[]>([])
const storiesByStatus = reactive<{ todo: PlanningItem[]; in_progress: PlanningItem[]; done: PlanningItem[] }>({
  todo: [], in_progress: [], done: []
})

const applyPlanningIndex = (items: PlanningItem[]) => {
  planningItems.value = items
  const stories = items.filter((i) => i.type === 'story')
  storiesByStatus.todo = stories.filter((s) => (s.status ?? 'todo') === 'todo')
  storiesByStatus.in_progress = stories.filter((s) => s.status === 'in_progress')
  storiesByStatus.done = stories.filter((s) => s.status === 'done')
}

onMounted(async () => {
  const { value: p } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  if (!p) return
  const idx = await window.localflow.getPlanningIndex({ projectPath: p })
  applyPlanningIndex(idx.items as any)
  window.localflow.onPlanningIndexUpdated((payload) => applyPlanningIndex(payload.items as any))
})

const inlineSetPriority = async (item: any, priority: string) => {
  try { await window.localflow.savePlanningItem({ path: item.path, data: { title: item.title, priority } }) } catch {}
  boardStatus.value = 'Priority updated'; setTimeout(()=>boardStatus.value='', 1200)
}

const inlineSetStatus = async (item: any, status: 'todo' | 'in_progress' | 'done') => {
  try {
    if (status === 'done') { const ok = window.confirm('Chuyển sang Done?'); if (!ok) return }
    await window.localflow.updatePlanningStatus({ path: item.path, status })
  } catch {}
  boardStatus.value = 'Status updated'; setTimeout(()=>boardStatus.value='', 1200)
}

let draggingPath: string | null = null
const onDragStart = (item: PlanningItem) => { draggingPath = item.path }
const onDrop = async (status: 'todo'|'in_progress'|'done', e: DragEvent) => {
  e.preventDefault()
  try {
    const item = planningItems.value.find((it) => it.path === draggingPath)
    if (!item) return
    await window.localflow.updatePlanningStatus({ path: item.path, status })
    boardStatus.value = 'Moved to ' + status
    setTimeout(()=>boardStatus.value='', 1200)
  } catch {}
}

const keyboardMove = async (item: PlanningItem, dir: 'left' | 'right') => {
  const order = ['todo', 'in_progress', 'done'] as const
  const idx = order.indexOf((item.status ?? 'todo') as any)
  const nextIdx = dir === 'left' ? Math.max(0, idx - 1) : Math.min(order.length - 1, idx + 1)
  const next = order[nextIdx]
  await inlineSetStatus(item as any, next)
}
</script>
