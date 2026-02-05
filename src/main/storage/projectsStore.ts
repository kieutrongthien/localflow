import Database from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'
import { mkdirSync } from 'node:fs'

let db: Database | null = null
let dbPathCache: string | null = null

type ProjectMetadataRecord = {
  projectPath: string
  name: string
  description: string
  team: string[]
  startDate: string
  endDate: string
  updatedAt: number
}

const ensureDatabase = () => {
  if (db) return db

  const dataDir = path.join(app.getPath('userData'), 'data')
  mkdirSync(dataDir, { recursive: true })
  const dbPath = path.join(dataDir, 'localflow.db')
  dbPathCache = dbPath

  db = new Database(dbPath)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT UNIQUE NOT NULL,
      lastOpened INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS project_metadata (
      projectPath TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      team TEXT NOT NULL,
      startDate TEXT NOT NULL,
      endDate TEXT NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      payload TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );
  `)

  return db
}

export const upsertProjectPath = (projectPath: string) => {
  const database = ensureDatabase()
  const stmt = database.prepare(
    `INSERT INTO projects (path, lastOpened)
     VALUES (@path, @lastOpened)
     ON CONFLICT(path)
     DO UPDATE SET lastOpened = excluded.lastOpened`
  )
  stmt.run({ path: projectPath, lastOpened: Date.now() })
}

export const listRecentProjects = (limit = 20): { path: string; lastOpened: number }[] => {
  const database = ensureDatabase()
  const stmt = database.prepare(
    `SELECT path, lastOpened FROM projects ORDER BY lastOpened DESC LIMIT ?`
  )
  return stmt.all(limit)
}

export const saveProjectMetadata = (metadata: ProjectMetadataRecord) => {
  const database = ensureDatabase()
  const stmt = database.prepare(
    `INSERT INTO project_metadata (projectPath, name, description, team, startDate, endDate, updatedAt)
     VALUES (@projectPath, @name, @description, @team, @startDate, @endDate, @updatedAt)
     ON CONFLICT(projectPath)
     DO UPDATE SET
       name = excluded.name,
       description = excluded.description,
       team = excluded.team,
       startDate = excluded.startDate,
       endDate = excluded.endDate,
       updatedAt = excluded.updatedAt`
  )

  stmt.run({
    ...metadata,
    team: JSON.stringify(metadata.team)
  })
}

export const getProjectMetadata = (projectPath: string): ProjectMetadataRecord | null => {
  const database = ensureDatabase()
  const stmt = database.prepare(
    `SELECT projectPath, name, description, team, startDate, endDate, updatedAt
     FROM project_metadata
     WHERE projectPath = ?`
  )
  const row = stmt.get(projectPath)
  if (!row) return null

  return {
    ...row,
    team: JSON.parse(row.team)
  }
}

const setSetting = (key: string, value: string) => {
  const database = ensureDatabase()
  const stmt = database.prepare(
    `INSERT INTO settings (key, value)
     VALUES (@key, @value)
     ON CONFLICT(key)
     DO UPDATE SET value = excluded.value`
  )
  stmt.run({ key, value })
}

export const setActiveProjectPath = (projectPath: string) => {
  setSetting('activeProjectPath', projectPath)
}

export const getActiveProjectPath = (): string | null => {
  const database = ensureDatabase()
  const row = database.prepare(`SELECT value FROM settings WHERE key = 'activeProjectPath'`).get()
  return row?.value ?? null
}

export const logActivity = (type: string, payload: Record<string, unknown>) => {
  const database = ensureDatabase()
  // Optional toggle; default off if not set
  const enabled = getSetting('activityEnabled') === 'true'
  if (!enabled) return
  const stmt = database.prepare(
    `INSERT INTO activity (type, payload, createdAt) VALUES (@type, @payload, @createdAt)`
  )
  stmt.run({ type, payload: JSON.stringify(payload ?? {}), createdAt: Date.now() })
}

export const listRecentActivity = (limit = 10): Array<{ id: number; type: string; payload: unknown; createdAt: number }> => {
  const database = ensureDatabase()
  const stmt = database.prepare(`SELECT id, type, payload, createdAt FROM activity ORDER BY createdAt DESC LIMIT ?`)
  const rows = stmt.all(limit)
  return rows.map((r) => ({ id: r.id, type: r.type, payload: safeParse(r.payload), createdAt: r.createdAt }))
}

const safeParse = (s: string) => {
  try { return JSON.parse(s) } catch { return s }
}

export const getDatabasePath = (): string => {
  if (dbPathCache) return dbPathCache
  // ensureDatabase will populate cache
  ensureDatabase()
  return dbPathCache as string
}

export const getSetting = (key: string): string | null => {
  const database = ensureDatabase()
  const row = database.prepare(`SELECT value FROM settings WHERE key = ?`).get(key)
  return row?.value ?? null
}

export const setSettingValue = (key: string, value: string) => setSetting(key, value)
