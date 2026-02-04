import { app, BrowserWindow, dialog, ipcMain, IpcMainInvokeEvent } from 'electron'
import { access, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import {
  IPC_CHANNELS,
  type IpcChannel,
  type PayloadFor,
  validateIpcPayload,
  type SaveProjectMetadataPayload
} from '../shared/ipc/schemas'
import { buildPlanningReadme } from '../shared/planning/readmeTemplate'
import {
  getProjectMetadata,
  saveProjectMetadata,
  setActiveProjectPath,
  upsertProjectPath
} from './storage/projectsStore'

export type Handler<T extends IpcChannel> = (
  event: IpcMainInvokeEvent,
  payload: PayloadFor<T>
) => unknown | Promise<unknown>

const registered = new Set<IpcChannel>()

const getWindowFromEvent = (event: IpcMainInvokeEvent) =>
  BrowserWindow.fromWebContents(event.sender)

const resolvePlanningDir = (projectPath: string) =>
  path.join(path.resolve(projectPath), '.planning')

const resolvePlanningReadme = (projectPath: string) =>
  path.join(resolvePlanningDir(projectPath), 'README.md')

const pathExists = async (target: string) => {
  try {
    await access(target)
    return true
  } catch {
    return false
  }
}

const ensurePlanningStructure = async (projectPath: string) => {
  const planningDir = resolvePlanningDir(projectPath)
  const readmePath = resolvePlanningReadme(projectPath)

  let planningCreated = false
  let readmeCreated = false

  if (!(await pathExists(planningDir))) {
    await mkdir(planningDir, { recursive: true })
    planningCreated = true
  }

  if (!(await pathExists(readmePath))) {
    await writeFile(readmePath, buildPlanningReadme(projectPath), 'utf-8')
    readmeCreated = true
  }

  return { planningDir, planningCreated, readmeCreated }
}

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
      return { path: null, planningPath: null, planningCreated: false, readmeCreated: false }
    }

    const projectPath = result.filePaths[0]
    const ensureResult = await ensurePlanningStructure(projectPath)
    upsertProjectPath(projectPath)

    setActiveProjectPath(projectPath)

    return {
      path: projectPath,
      planningPath: ensureResult.planningDir,
      planningCreated: ensureResult.planningCreated,
      readmeCreated: ensureResult.readmeCreated
    }
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

  registerIpcHandler(IPC_CHANNELS.GET_PROJECT_METADATA, async (_event, payload) => {
    const metadata = getProjectMetadata(payload.projectPath)

    if (!metadata) {
      return {
        projectPath: payload.projectPath,
        name: '',
        description: '',
        team: [],
        startDate: '',
        endDate: ''
      }
    }

    return metadata
  })

  registerIpcHandler(IPC_CHANNELS.SAVE_PROJECT_METADATA, async (_event, payload) => {
    const data: SaveProjectMetadataPayload = payload

    saveProjectMetadata({
      ...data,
      team: data.team,
      updatedAt: Date.now()
    })

    upsertProjectPath(data.projectPath)
    setActiveProjectPath(data.projectPath)

    return { success: true }
  })
}
