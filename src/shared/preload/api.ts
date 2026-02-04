import type { IPC_CHANNELS } from '../ipc/schemas'

export type SelectProjectRootResult = {
  path: string | null
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

export interface LocalflowBridge {
  ping(): string
  getVersion(): Promise<string>
  selectProjectRoot(): Promise<SelectProjectRootResult>
  readPlanningReadme(payload: ReadPlanningReadmePayload): Promise<ReadPlanningReadmeResult>
  writePlanningReadme(payload: WritePlanningReadmePayload): Promise<WritePlanningReadmeResult>
}

declare global {
  interface Window {
    localflow: LocalflowBridge
  }
}
