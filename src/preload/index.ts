import { contextBridge, ipcRenderer } from 'electron'

const api = {
  ping: () => 'pong',
  getVersion: () => ipcRenderer.invoke('system:getVersion')
} as const

contextBridge.exposeInMainWorld('localflow', api)
