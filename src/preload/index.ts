import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, allowedChannels, type IpcChannel, type PayloadFor } from '../shared/ipc/schemas'
import type {
  LocalflowBridge,
  ProjectMetadataPayload,
  ReadPlanningReadmePayload,
  SaveProjectMetadataPayload,
  WritePlanningReadmePayload
} from '../shared/preload/api'

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
    invokeSafe(IPC_CHANNELS.SAVE_PROJECT_METADATA, payload)
}

contextBridge.exposeInMainWorld('localflow', api)
