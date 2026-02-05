import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, allowedChannels, type IpcChannel, type PayloadFor } from '../shared/ipc/schemas'
import type {
  LocalflowBridge,
  PlanningIndexPayload,
  PlanningIndexResult,
  ProjectMetadataPayload,
  ReadPlanningReadmePayload,
  SaveProjectMetadataPayload,
  WritePlanningReadmePayload
} from '../shared/preload/api'
import { IPC_EVENTS } from '../shared/preload/api'

const invokeSafe = <T extends IpcChannel>(channel: T, payload?: PayloadFor<T>) => {
  if (!allowedChannels.includes(channel)) {
    throw new Error(`Blocked IPC channel: ${channel}`)
  }

  return ipcRenderer.invoke(channel, payload)
}

const api: LocalflowBridge = {
  ping: () => 'pong',
  getVersion: () => invokeSafe(IPC_CHANNELS.GET_VERSION),
  selectProjectRoot: () => invokeSafe(IPC_CHANNELS.SELECT_PROJECT_ROOT),
  readPlanningReadme: (payload: ReadPlanningReadmePayload) =>
    invokeSafe(IPC_CHANNELS.READ_PLANNING_README, payload),
  writePlanningReadme: (payload: WritePlanningReadmePayload) =>
    invokeSafe(IPC_CHANNELS.WRITE_PLANNING_README, payload),
  getProjectMetadata: (payload: ProjectMetadataPayload) =>
    invokeSafe(IPC_CHANNELS.GET_PROJECT_METADATA, payload),
  saveProjectMetadata: (payload: SaveProjectMetadataPayload) =>
    invokeSafe(IPC_CHANNELS.SAVE_PROJECT_METADATA, payload),
  getPlanningIndex: (payload: PlanningIndexPayload) =>
    invokeSafe(IPC_CHANNELS.PLANNING_INDEX, payload),
  listBackups: (payload: { projectPath: string }) =>
    invokeSafe(IPC_CHANNELS.BACKUP_LIST, payload),
  createBackup: (payload: { projectPath: string }) =>
    invokeSafe(IPC_CHANNELS.BACKUP_CREATE, payload),
  restoreBackup: (payload: { projectPath: string; id: string }) =>
    invokeSafe(IPC_CHANNELS.BACKUP_RESTORE, payload),
  getSetting: (payload: { key: string }) => invokeSafe(IPC_CHANNELS.SETTINGS_GET, payload),
  setSetting: (payload: { key: string; value: string }) => invokeSafe(IPC_CHANNELS.SETTINGS_SET, payload),
  getSettings: (payload: { keys: string[] }) => invokeSafe('settings:get-many' as any, payload),
  setSettings: (payload: { kv: Record<string, string> }) => invokeSafe('settings:set-many' as any, payload),
  updatePlanningStatus: (payload: { path: string; status: string }) =>
    invokeSafe(IPC_CHANNELS.PLANNING_UPDATE_STATUS, payload),
  listActivity: (payload: { limit?: number } = {}) => invokeSafe(IPC_CHANNELS.ACTIVITY_LIST, payload),
  getDatabasePath: () => invokeSafe(IPC_CHANNELS.DB_PATH, undefined),
  exportPlanningJson: (payload: { projectPath: string }) =>
    invokeSafe(IPC_CHANNELS.PLANNING_EXPORT_JSON, payload),
  importPlanningJson: (payload: { projectPath: string }) =>
    invokeSafe(IPC_CHANNELS.PLANNING_IMPORT_JSON, payload),
  checkUpdate: (payload: { feedPath?: string }) => invokeSafe('update:check' as any, payload),
  savePlanningItem: (payload: { path: string; data: { title: string; status?: string; priority?: string; points?: number | null; owner?: string; assignee?: string; tags?: string[] } }) => invokeSafe('planning:save-item' as any, payload),
  readPlanningFile: (payload: { path: string }) => invokeSafe('planning:read-file' as any, payload),
  generateReleaseNotes: (payload: { projectPath: string; limit?: number }) => invokeSafe('release:notes:generate' as any, payload),
  onPlanningIndexUpdated: (callback: (payload: PlanningIndexResult) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, payload: PlanningIndexResult) => {
      callback(payload)
    }

    ipcRenderer.on(IPC_EVENTS.PLANNING_INDEX_UPDATED, listener)

    return () => {
      ipcRenderer.removeListener(IPC_EVENTS.PLANNING_INDEX_UPDATED, listener)
    }
  }
}

contextBridge.exposeInMainWorld('localflow', api)
