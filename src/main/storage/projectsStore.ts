import Database from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'
import { mkdirSync } from 'node:fs'

let db: Database | null = null

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
