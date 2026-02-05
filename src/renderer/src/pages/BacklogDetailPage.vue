<template>
  <div class="space-y-4">
    <nav v-if="breadcrumbs.length" class="text-sm text-zinc-400">
      <RouterLink v-for="(bc,i) in breadcrumbs" :key="bc.path" :to="`/detail?path=${encodeURIComponent(bc.path)}`" class="underline hover:opacity-80">
        {{ bc.label }}
      </RouterLink>
      <span v-for="(bc,i) in breadcrumbs" :key="bc.path+'sep'" v-if="i<breadcrumbs.length-1"> → </span>
    </nav>
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
        <RouterLink v-if="item?.type==='epic'" to="/epic-editor" class="px-3 py-1 rounded bg-white/10 text-sm">Edit Epic</RouterLink>
        <RouterLink v-if="item?.type==='story'" to="/story-editor" class="px-3 py-1 rounded bg-white/10 text-sm">Edit Story</RouterLink>
        <RouterLink v-if="item?.type==='task'" to="/task-editor" class="px-3 py-1 rounded bg-white/10 text-sm">Edit Task</RouterLink>
      </div>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4">
      <h3 class="mb-2">Content</h3>
      <pre class="text-sm whitespace-pre-wrap">{{ content }}</pre>
    </div>

    <div class="rounded-xl border border-white/10 bg-white/5 p-4" v-if="related.length">
      <h3 class="mb-2">Related</h3>
      <ul class="text-sm">
        <li v-for="r in related" :key="r.path">
          <RouterLink :to="`/detail?path=${encodeURIComponent(r.path)}`" class="underline hover:opacity-80">{{ r.type }}: {{ r.title }}</RouterLink>
        </li>
      </ul>
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
const breadcrumbs = ref<Array<{ label: string; path: string }>>([])
const related = ref<Array<{ type: string; title: string; path: string }>>([])

const linkFor = (p: string) => `/detail?path=${encodeURIComponent(p)}`

onMounted(async () => {
  const path = (route.query.path as string) || ''
  if (!path) return
  const res = await window.localflow.readPlanningFile({ path })
  const parsed = matter(res.content || '')
  frontmatter.value = parsed.data
  content.value = parsed.content
  item.value = { type: parsed.data?.type || '', filename: path.split('/').pop() || '', path }

  // Build breadcrumbs and related from index
  const { value: projectPath } = await window.localflow.getSetting({ key: 'activeProjectPath' })
  if (projectPath) {
    const idx = await window.localflow.getPlanningIndex({ projectPath })
    const current = idx.items.find((i) => i.path === path)
    if (!current) return
    const bc: Array<{ label: string; path: string }> = []
    const rel: Array<{ type: string; title: string; path: string }> = []
    if (current.type === 'epic') {
      bc.push({ label: `Epic: ${current.title}`, path: current.path })
      // child stories
      rel.push(...idx.items.filter((i) => i.type === 'story' && i.parentEpicPath === current.path).map((i) => ({ type: 'Story', title: i.title, path: i.path })))
    } else if (current.type === 'story') {
      if (current.parentEpicPath) {
        const epic = idx.items.find((i) => i.type === 'epic' && i.path === current.parentEpicPath)
        if (epic) bc.push({ label: `Epic: ${epic.title}`, path: epic.path })
      }
      bc.push({ label: `Story: ${current.title}`, path: current.path })
      // tasks linked to this story
      rel.push(...idx.items.filter((i) => i.type === 'task' && i.linkedStoryPath === current.path).map((i) => ({ type: 'Task', title: i.title, path: i.path })))
    } else if (current.type === 'task') {
      let storyLabel = ''
      if (current.linkedStoryPath) {
        const story = idx.items.find((i) => i.type === 'story' && i.path === current.linkedStoryPath)
        if (story) {
          storyLabel = story.title
          if (story.parentEpicPath) {
            const epic = idx.items.find((i) => i.type === 'epic' && i.path === story.parentEpicPath)
            if (epic) bc.push({ label: `Epic: ${epic.title}`, path: epic.path })
          }
          bc.push({ label: `Story: ${story.title}`, path: story.path })
        }
      }
      bc.push({ label: `Task: ${current.title}`, path: current.path })
      // sibling tasks under same story
      if (current.linkedStoryPath) {
        rel.push(...idx.items.filter((i) => i.type === 'task' && i.linkedStoryPath === current.linkedStoryPath && i.path !== current.path).map((i) => ({ type: 'Task', title: i.title, path: i.path })))
      }
    }
    breadcrumbs.value = bc
    related.value = rel
  }
})
</script>
