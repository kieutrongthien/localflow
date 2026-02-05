<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <h2 class="text-lg font-semibold">Detail</h2>
      <span class="text-sm text-zinc-400">{{ item?.type || '' }}</span>
      <span class="ml-auto text-sm text-zinc-500" v-if="item">{{ item.filename }}</span>
    </div>

    <div v-if="frontmatter" class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Frontmatter</h3>
      <ul class="text-sm grid md:grid-cols-2 gap-2">
        <li><strong>Title:</strong> {{ frontmatter.title }}</li>
        <li><strong>Status:</strong> {{ frontmatter.status || '-' }}</li>
        <li><strong>Priority:</strong> {{ frontmatter.priority || '-' }}</li>
        <li><strong>Points:</strong> {{ frontmatter.points ?? '-' }}</li>
        <li v-if="frontmatter.owner"><strong>Owner:</strong> {{ frontmatter.owner }}</li>
        <li v-if="frontmatter.assignee"><strong>Assignee:</strong> {{ frontmatter.assignee }}</li>
        <li v-if="frontmatter.parentEpicPath"><strong>Epic:</strong> <RouterLink :to="linkFor(frontmatter.parentEpicPath)">Open Epic</RouterLink></li>
        <li v-if="frontmatter.linkedStoryPath"><strong>Story:</strong> <RouterLink :to="linkFor(frontmatter.linkedStoryPath)">Open Story</RouterLink></li>
      </ul>
      <div class="mt-3 flex gap-2">
        <RouterLink v-if="item?.type==='story'" to="/story-editor" class="px-3 py-1 rounded bg-white/10 text-sm">Edit Story</RouterLink>
        <RouterLink v-if="item?.type==='task'" to="/task-editor" class="px-3 py-1 rounded bg-white/10 text-sm">Edit Task</RouterLink>
      </div>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Content</h3>
      <pre class="text-sm whitespace-pre-wrap">{{ content }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import matter from 'gray-matter'

const route = useRoute()
const item = ref<{ type: string; filename: string; path: string } | null>(null)
const frontmatter = ref<any>(null)
const content = ref('')

const linkFor = (p: string) => `/detail?path=${encodeURIComponent(p)}`

onMounted(async () => {
  const path = (route.query.path as string) || ''
  if (!path) return
  const res = await window.localflow.readPlanningFile({ path })
  const parsed = matter(res.content || '')
  frontmatter.value = parsed.data
  content.value = parsed.content
  item.value = { type: parsed.data?.type || '', filename: path.split('/').pop() || '', path }
})
</script>
