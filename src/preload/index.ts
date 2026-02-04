import { contextBridge, ipcRenderer } from 'electron'
import { IPC_CHANNELS, allowedChannels, type IpcChannel, type PayloadFor } from '../shared/ipc/schemas'

const invokeSafe = <T extends IpcChannel>(channel: T, payload?: PayloadFor<T>) => {
  if (!allowedChannels.includes(channel)) {
    throw new Error(`Blocked IPC channel: ${channel}`)
  }

  return ipcRenderer.invoke(channel, payload)
}

const api = {
  ping: () => 'pong',
  getVersion: () => invokeSafe(IPC_CHANNELS.GET_VERSION)
} as const

contextBridge.exposeInMainWorld('localflow', api)
