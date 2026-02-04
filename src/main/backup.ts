import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

const BACKUP_DIRNAME = '.localflow_backups'

const ensureDir = async (dir: string) => {
  await mkdir(dir, { recursive: true })
}

const cpDir = async (src: string, dest: string) => {
  // Node 22: fs.cp available via promises as (rm + recreate) fallback for portability
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      await cpDir(srcPath, destPath)
    } else if (entry.isFile()) {
      const content = await readFile(srcPath)
      await writeFile(destPath, content)
    }
  }
}

export type BackupEntry = {
  id: string
  createdAt: number
  planningPath: string
  dbPath?: string | null
}

export const listBackups = async (projectPath: string): Promise<BackupEntry[]> => {
  const root = path.join(projectPath, BACKUP_DIRNAME)
  try {
    const names = await readdir(root)
    const entries: BackupEntry[] = []
    for (const name of names) {
      const dir = path.join(root, name)
      const s = await stat(dir)
      if (!s.isDirectory()) continue
      const planningPath = path.join(dir, 'planning')
      const dbPath = path.join(dir, 'db.sqlite')
      entries.push({ id: name, createdAt: s.mtimeMs, planningPath, dbPath })
    }
    return entries.sort((a, b) => b.createdAt - a.createdAt)
  } catch {
    return []
  }
}

export const createBackup = async (projectPath: string, planningDir: string, dbPath?: string | null) => {
  const root = path.join(projectPath, BACKUP_DIRNAME)
  await ensureDir(root)
  const id = new Date().toISOString().replace(/[:.]/g, '-')
  const target = path.join(root, id)
  await ensureDir(target)
  await cpDir(planningDir, path.join(target, 'planning'))
  if (dbPath) {
    try {
      const content = await readFile(dbPath)
      await writeFile(path.join(target, 'db.sqlite'), content)
    } catch {
      // ignore db copy errors
    }
  }
  return { id }
}

export const restoreBackup = async (projectPath: string, id: string, planningDir: string, dbPath?: string | null) => {
  const root = path.join(projectPath, BACKUP_DIRNAME)
  const source = path.join(root, id)
  const sourcePlanning = path.join(source, 'planning')
  await rm(planningDir, { recursive: true, force: true })
  await ensureDir(planningDir)
  await cpDir(sourcePlanning, planningDir)
  if (dbPath) {
    try {
      const content = await readFile(path.join(source, 'db.sqlite'))
      await writeFile(dbPath, content)
    } catch {
      // ignore db restore errors
    }
  }
  return { success: true }
}

