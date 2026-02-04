import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type {
  PlanningIndexResult,
  PlanningItem,
  PlanningKind,
  PlanningFrontmatter
} from '../../shared/planning/types'
import { planningSchema } from '../../shared/planning/schema'

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

const validateFrontmatter = (kind: PlanningKind, data: unknown): PlanningFrontmatter | null => {
  try {
    const parsed = planningSchema.parse(data)
    if (parsed.type !== kind) {
      throw new Error(`Frontmatter type mismatch: expected ${kind}, got ${parsed.type}`)
    }
    return parsed
  } catch (error) {
    console.warn('[planning:indexer] Invalid frontmatter', { kind, error })
    return null
  }
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
      title: (validated.title || content.split('\n')[0]?.replace('#', '').trim() || filename).trim(),
      status: validated.status,
      priority: validated.priority,
      points: kind === 'task' || kind === 'story' ? parsePoints(validated.points) : null,
      links: validated.links,
      tags: validated.tags,
      owner: 'owner' in validated ? validated.owner : undefined,
      assignee: 'assignee' in validated ? validated.assignee : undefined,
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
