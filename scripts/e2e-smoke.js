#!/usr/bin/env node
// E2E smoke script: create temp project, materialize .planning, index, print summary
import { mkdtemp, writeFile, mkdir, rm, readdir, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'

const indexPlanning = async (projectPath) => {
  const planningRoot = path.join(projectPath, '.planning')
  const dirs = [
    { kind: 'epic', folder: 'epics' },
    { kind: 'story', folder: 'stories' },
    { kind: 'task', folder: 'tasks' }
  ]
  const items = []
  for (const entry of dirs) {
    const dir = path.join(planningRoot, entry.folder)
    try {
      const files = await readdir(dir)
      for (const f of files.filter((n) => n.endsWith('.md'))) {
        const filePath = path.join(dir, f)
        const raw = await readFile(filePath, 'utf-8')
        const { data, content } = matter(raw)
        items.push({ type: entry.kind, title: data.title ?? content.split('\n')[0]?.replace('#', '').trim() ?? f })
      }
    } catch {}
  }
  const totals = {
    epic: items.filter((i) => i.type === 'epic').length,
    story: items.filter((i) => i.type === 'story').length,
    task: items.filter((i) => i.type === 'task').length,
    all: items.length
  }
  return { items, totals }
}

const main = async () => {
  const tmp = await mkdtemp(path.join(os.tmpdir(), 'localflow-e2e-'))
  const planning = path.join(tmp, '.planning')
  const epics = path.join(planning, 'epics')
  const stories = path.join(planning, 'stories')
  const tasks = path.join(planning, 'tasks')
  await mkdir(epics, { recursive: true })
  await mkdir(stories, { recursive: true })
  await mkdir(tasks, { recursive: true })

  const fm = (type, title) => `---\n
type: ${type}\n
status: todo\n
points: 1\n
---\n
# ${title}\n\nDesc\n`
  await writeFile(path.join(epics, '001-demo-epic.md'), fm('epic', 'Demo Epic'), 'utf-8')
  await writeFile(path.join(stories, '001-demo-story.md'), fm('story', 'Demo Story'), 'utf-8')
  await writeFile(path.join(tasks, '001-demo-task.md'), fm('task', 'Demo Task'), 'utf-8')

  const idx = await indexPlanning(tmp)
  const summary = {
    projectPath: tmp,
    totals: idx.totals,
    firstItems: idx.items.slice(0, 3)
  }
  console.log(JSON.stringify(summary, null, 2))

  // Cleanup temp project
  await rm(tmp, { recursive: true, force: true })
}

main().catch((err) => {
  console.error('[e2e-smoke] failed', err)
  process.exit(1)
})
