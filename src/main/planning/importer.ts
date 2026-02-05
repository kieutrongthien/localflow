import path from 'node:path'
import { mkdir, writeFile, stat } from 'node:fs/promises'

export type IndexItem = { type: string; filename?: string; path?: string; title?: string }

const ensureDir = async (dir: string) => {
  await mkdir(dir, { recursive: true })
}

const fileExists = async (p: string) => {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

const resolvePlanningDir = (projectPath: string) => path.join(projectPath, '.planning')

const byType: Record<string, string> = { epic: 'epics', story: 'stories', task: 'tasks' }

const uniquePath = async (dir: string, base: string) => {
  let candidate = path.join(dir, base)
  if (!(await fileExists(candidate))) return { path: candidate }
  const { name, ext } = path.parse(base)
  let i = 1
  while (true) {
    const next = path.join(dir, `${name}-import-${i}${ext}`)
    if (!(await fileExists(next))) return { path: next, conflict: { original: base, resolved: path.basename(next) } }
    i++
  }
}

export const importFromIndexJson = async (projectPath: string, items: IndexItem[]) => {
  const planningDir = resolvePlanningDir(projectPath)
  const conflicts: Array<{ original: string; resolved: string }> = []
  let created = 0
  for (const item of items ?? []) {
    const folderName = byType[item.type]
    if (!folderName) continue
    const dir = path.join(planningDir, folderName)
    await ensureDir(dir)
    const base = item.filename ?? path.basename(item.path ?? `${item.type}-${Date.now()}.md`)
    const up = await uniquePath(dir, base)
    if (up.conflict) conflicts.push(up.conflict)
    const fm = {
      type: item.type,
      status: 'todo',
      title: item.title ?? base
    }
    const md = (await import('gray-matter')).default.stringify('', fm)
    await writeFile(up.path, md, 'utf-8')
    created++
  }
  return { created, conflicts }
}

