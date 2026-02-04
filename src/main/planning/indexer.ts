import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { PlanningIndexResult, PlanningItem, PlanningKind } from '../../shared/planning/types'

const PLANNING_DIRS: Array<{ kind: PlanningKind; folder: string }> = [
  { kind: 'epic', folder: 'epics' },
  { kind: 'story', folder: 'stories' },
  { kind: 'task', folder: 'tasks' }
]

const parsePoints = (value: unknown): number | null => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  return null
}

const parseLinks = (value: unknown): string[] | undefined => {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean)
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    return value
      .split(',')
      .map((link) => link.trim())
      .filter(Boolean)
  }

  return undefined
}

const parsePlanningFile = async (filePath: string, kind: PlanningKind): Promise<PlanningItem | null> => {
  try {
    const raw = await readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)

    const filename = path.basename(filePath)
    const [id = ''] = filename.split('-', 1)

    return {
      id: id || filename,
      filename,
      type: kind,
      title: (data.title as string) ?? content.split('\n')[0]?.replace('#', '').trim() ?? filename,
      status: data.status as string | undefined,
      priority: data.priority as string | undefined,
      points: kind === 'task' || kind === 'story' ? parsePoints(data.points) : null,
      links: parseLinks(data.links),
      path: filePath
    }
  } catch (error) {
    console.warn('[planning:indexer] Failed to parse', filePath, error)
    return null
  }
}

export const buildPlanningIndex = async (projectPath: string): Promise<PlanningIndexResult> => {
  const planningRoot = path.join(projectPath, '.planning')
  const items: PlanningItem[] = []

  for (const entry of PLANNING_DIRS) {
    const dir = path.join(planningRoot, entry.folder)

    try {
      const files = await readdir(dir)

      const parsed = await Promise.all(
        files
          .filter((filename) => filename.endsWith('.md'))
          .map((filename) => parsePlanningFile(path.join(dir, filename), entry.kind))
      )

      items.push(...parsed.filter(Boolean) as PlanningItem[])
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.warn('[planning:indexer] Failed reading dir', dir, error)
      }
    }
  }

  items.sort((a, b) => {
    if (a.type === b.type) {
      return a.id.localeCompare(b.id)
    }

    return a.type.localeCompare(b.type)
  })

  const totals = {
    epic: items.filter((item) => item.type === 'epic').length,
    story: items.filter((item) => item.type === 'story').length,
    task: items.filter((item) => item.type === 'task').length
  }

  return {
    projectPath,
    items,
    totals: {
      ...totals,
      all: items.length
    }
  }
}
