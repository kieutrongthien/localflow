import { describe, it, expect } from 'vitest'
import { mkdtemp, writeFile, mkdir, readFile, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import matter from 'gray-matter'
import { buildPlanningIndex } from '../src/main/planning/indexer'

const fm = (data: any) => matter.stringify('', data)

describe('Boards drag-drop + CRUD (E2E-lite)', () => {
  it('updates status via simulated drag-drop and performs CRUD on stories/tasks', async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), 'lf-boards-'))
    const planning = path.join(tmp, '.planning')
    const storiesDir = path.join(planning, 'stories')
    const tasksDir = path.join(planning, 'tasks')
    await mkdir(storiesDir, { recursive: true })
    await mkdir(tasksDir, { recursive: true })

    // Create a story
    const storyPath = path.join(storiesDir, '001-story-a.md')
    await writeFile(
      storyPath,
      fm({ type: 'story', title: 'Story A', status: 'todo', priority: 'Medium' }),
      'utf-8'
    )

    // Create a task linked to story
    const taskPath = path.join(tasksDir, '001-task-a.md')
    await writeFile(
      taskPath,
      fm({ type: 'task', title: 'Task A', status: 'todo', linkedStoryPath: storyPath }),
      'utf-8'
    )

    // Index initial
    let idx = await buildPlanningIndex(tmp)
    const storyA = idx.items.find((i) => i.path === storyPath)
    const taskA = idx.items.find((i) => i.path === taskPath)
    expect(storyA?.status).toBe('todo')
    expect(taskA?.linkedStoryPath).toBe(storyPath)

    // Simulate drag-drop: move story to in_progress
    const raw = await readFile(storyPath, 'utf-8')
    const parsed = matter(raw)
    parsed.data.status = 'in_progress'
    await writeFile(storyPath, matter.stringify(parsed.content, parsed.data), 'utf-8')

    // Refresh index
    idx = await buildPlanningIndex(tmp)
    const storyAfter = idx.items.find((i) => i.path === storyPath)
    expect(storyAfter?.status).toBe('in_progress')

    // CRUD: update priority
    const raw2 = await readFile(storyPath, 'utf-8')
    const parsed2 = matter(raw2)
    parsed2.data.priority = 'High'
    await writeFile(storyPath, matter.stringify(parsed2.content, parsed2.data), 'utf-8')
    idx = await buildPlanningIndex(tmp)
    expect(idx.items.find((i) => i.path === storyPath)?.priority).toBe('High')

    // CRUD: create another story and delete first
    const storyBPath = path.join(storiesDir, '002-story-b.md')
    await writeFile(storyBPath, fm({ type: 'story', title: 'Story B', status: 'todo' }), 'utf-8')
    await rm(storyPath)
    idx = await buildPlanningIndex(tmp)
    expect(idx.items.some((i) => i.path === storyPath)).toBe(false)
    expect(idx.items.some((i) => i.path === storyBPath)).toBe(true)
  })
})
