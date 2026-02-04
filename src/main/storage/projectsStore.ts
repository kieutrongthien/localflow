import Database from 'better-sqlite3'
import path from 'node:path'
import { app } from 'electron'
import { mkdirSync } from 'node:fs'

let db: Database | null = null

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
