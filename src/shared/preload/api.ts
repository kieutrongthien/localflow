import type { PlanningIndexResult } from '../planning/types'

export const IPC_EVENTS = {
  PLANNING_INDEX_UPDATED: 'planning:index-updated'
} as const

export type SelectProjectRootResult = {
  path: string | null
  planningPath: string | null
  planningCreated: boolean
  readmeCreated: boolean
}

export type ReadPlanningReadmePayload = {
  projectPath: string
}

export type ReadPlanningReadmeResult = {
  content: string
}

export type WritePlanningReadmePayload = {
  projectPath: string
  content: string
}

export type WritePlanningReadmeResult = {
  success: boolean
}

export type ProjectMetadataPayload = {
  projectPath: string
}

export type ProjectMetadataResult = {
  projectPath: string
  name: string
  description: string
  team: string[]
  startDate: string
  endDate: string
}

export type SaveProjectMetadataPayload = ProjectMetadataResult

export type SaveProjectMetadataResult = {
  success: boolean
}

export type PlanningIndexPayload = {
  projectPath: string
}

export type BackupListPayload = { projectPath: string }
export type BackupListResult = { entries: { id: string; createdAt: number }[]; planningPath: string }
export type BackupCreatePayload = { projectPath: string }
export type BackupCreateResult = { id: string }
export type BackupRestorePayload = { projectPath: string; id: string }
export type BackupRestoreResult = { success: boolean }

export type SettingsGetPayload = { key: string }
export type SettingsGetResult = { value: string | null }
export type SettingsSetPayload = { key: string; value: string }
export type SettingsSetResult = { success: boolean }
export type SettingsGetManyPayload = { keys: string[] }
export type SettingsGetManyResult = { values: Record<string, string | null> }
export type SettingsSetManyPayload = { kv: Record<string, string> }
export type SettingsSetManyResult = { success: boolean }
export type ActivityListPayload = { limit?: number }
export type ActivityEntry = { id: number; type: string; payload: unknown; createdAt: number }
export type ActivityListResult = { entries: ActivityEntry[] }
export type DatabasePathResult = { path: string }
export type PlanningExportJsonPayload = { projectPath: string }
export type PlanningExportJsonResult = { success?: boolean; path?: string; canceled?: boolean }
export type PlanningImportJsonPayload = { projectPath: string }
export type PlanningImportJsonResult = { success?: boolean; created?: number; canceled?: boolean; conflicts?: Array<{ original: string; resolved: string }> }
export type UpdateCheckPayload = { feedPath?: string }
export type UpdateCheckResult = { hasUpdate: boolean; currentVersion: string; latestVersion?: string; notes?: string; error?: string }

export interface LocalflowBridge {
  ping(): string
  getVersion(): Promise<string>
  selectProjectRoot(): Promise<SelectProjectRootResult>
  readPlanningReadme(payload: ReadPlanningReadmePayload): Promise<ReadPlanningReadmeResult>
  writePlanningReadme(payload: WritePlanningReadmePayload): Promise<WritePlanningReadmeResult>
  getProjectMetadata(payload: ProjectMetadataPayload): Promise<ProjectMetadataResult>
  saveProjectMetadata(payload: SaveProjectMetadataPayload): Promise<SaveProjectMetadataResult>
  getPlanningIndex(payload: PlanningIndexPayload): Promise<PlanningIndexResult>
  listBackups(payload: BackupListPayload): Promise<BackupListResult>
  createBackup(payload: BackupCreatePayload): Promise<BackupCreateResult>
  restoreBackup(payload: BackupRestorePayload): Promise<BackupRestoreResult>
  getSetting(payload: SettingsGetPayload): Promise<SettingsGetResult>
  setSetting(payload: SettingsSetPayload): Promise<SettingsSetResult>
  getSettings(payload: SettingsGetManyPayload): Promise<SettingsGetManyResult>
  setSettings(payload: SettingsSetManyPayload): Promise<SettingsSetManyResult>
  updatePlanningStatus(payload: { path: string; status: string }): Promise<{ success: boolean }>
  listActivity(payload: ActivityListPayload): Promise<ActivityListResult>
  getDatabasePath(): Promise<DatabasePathResult>
  exportPlanningJson(payload: PlanningExportJsonPayload): Promise<PlanningExportJsonResult>
  importPlanningJson(payload: PlanningImportJsonPayload): Promise<PlanningImportJsonResult>
  checkUpdate(payload: UpdateCheckPayload): Promise<UpdateCheckResult>
  savePlanningItem(payload: { path: string; data: { title: string; status?: string; priority?: string; points?: number | null; owner?: string; assignee?: string; tags?: string[] } }): Promise<{ success: boolean }>
  onPlanningIndexUpdated(callback: (payload: PlanningIndexResult) => void): () => void
}

declare global {
  interface Window {
    localflow: LocalflowBridge
  }
}
