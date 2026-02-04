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
  onPlanningIndexUpdated(callback: (payload: PlanningIndexResult) => void): () => void
}

declare global {
  interface Window {
    localflow: LocalflowBridge
  }
}
