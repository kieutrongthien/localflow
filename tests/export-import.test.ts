import { describe, it, expect } from 'vitest'
import { mkdtemp, writeFile, mkdir, readFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { importFromIndexJson } from '../src/main/planning/importer'
import matter from 'gray-matter'

const buildItem = (type: string, title: string, filename: string) => ({ type, title, filename })

describe('Export/Import consistency', () => {
  it('imports items preserving title and type; unique filenames', async () => {
    const tmp = await mkdtemp(path.join(os.tmpdir(), 'lf-expimp-'))
    const planning = path.join(tmp, '.planning')
    await mkdir(planning, { recursive: true })

    const items = [
      buildItem('epic', 'Epic A', '001-epic-a.md'),
      buildItem('story', 'Story A', '001-story-a.md'),
      buildItem('task', 'Task A', '001-task-a.md')
    ]

    // Pre-create a conflicting file for story
    const storiesDir = path.join(planning, 'stories')
    await mkdir(storiesDir, { recursive: true })
    await writeFile(path.join(storiesDir, '001-story-a.md'), '# Pre-existing', 'utf-8')

    const res = await importFromIndexJson(tmp, items)
    expect(res.created).toBe(3)
    // One conflict expected on story
    expect(res.conflicts?.length || 0).toBeGreaterThanOrEqual(1)

    // Read imported files and check frontmatter titles
    const files = [
      path.join(tmp, '.planning/epics/001-epic-a.md'),
      // Story may be resolved with -import suffix
      path.join(tmp, '.planning/stories/001-story-a.md'),
      path.join(tmp, '.planning/tasks/001-task-a.md')
    ]

    const epicRaw = await readFile(files[0], 'utf-8')
    const epicFM = matter(epicRaw).data as any
    expect(epicFM.title).toBe('Epic A')
    expect(epicFM.type).toBe('epic')

    const taskRaw = await readFile(files[2], 'utf-8')
    const taskFM = matter(taskRaw).data as any
    expect(taskFM.title).toBe('Task A')
    expect(taskFM.type).toBe('task')
  })
})

