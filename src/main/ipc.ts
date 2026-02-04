import { app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { IPC_CHANNELS, type IpcChannel, type PayloadFor, validateIpcPayload } from '../shared/ipc/schemas'

export type Handler<T extends IpcChannel> = (
  event: IpcMainInvokeEvent,
  payload: PayloadFor<T>
) => unknown | Promise<unknown>

const registered = new Set<IpcChannel>()

const getWindowFromEvent = (event: IpcMainInvokeEvent) =>
  BrowserWindow.fromWebContents(event.sender)

const resolvePlanningReadme = (projectPath: string) =>
  path.join(path.resolve(projectPath), '.planning', 'README.md')

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

  registerIpcHandler(IPC_CHANNELS.SELECT_PROJECT_ROOT, async (event) => {
    const browserWindow = getWindowFromEvent(event)
    const result = await dialog.showOpenDialog(browserWindow ?? undefined, {
      title: 'Chọn thư mục dự án LocalFlow',
      properties: ['openDirectory', 'createDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return { path: null }
    }

    return { path: result.filePaths[0] }
  })

  registerIpcHandler(IPC_CHANNELS.READ_PLANNING_README, async (_event, payload) => {
    const targetPath = resolvePlanningReadme(payload.projectPath)

    try {
      const content = await readFile(targetPath, 'utf-8')
      return { content }
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      if (code === 'ENOENT') {
        return { content: '' }
      }

      throw error
    }
  })

  registerIpcHandler(IPC_CHANNELS.WRITE_PLANNING_README, async (_event, payload) => {
    const targetPath = resolvePlanningReadme(payload.projectPath)
    await mkdir(path.dirname(targetPath), { recursive: true })
    await writeFile(targetPath, payload.content, 'utf-8')
    return { success: true }
  })
}
