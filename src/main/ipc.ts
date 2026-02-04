import { app, ipcMain, IpcMainInvokeEvent } from 'electron'
import { IPC_CHANNELS, type IpcChannel, type PayloadFor, validateIpcPayload } from '../shared/ipc/schemas'

export type Handler<T extends IpcChannel> = (
  event: IpcMainInvokeEvent,
  payload: PayloadFor<T>
) => unknown | Promise<unknown>

const registered = new Set<IpcChannel>()

export const registerIpcHandler = <T extends IpcChannel>(channel: T, handler: Handler<T>) => {
  if (registered.has(channel)) {
    return
  }

  registered.add(channel)

  ipcMain.handle(channel, async (event, payload) => {
    const data = validateIpcPayload(channel, payload)
    return handler(event, data as never)
  })
}

export const bootIpc = () => {
  registerIpcHandler(IPC_CHANNELS.GET_VERSION, () => app.getVersion())
}
