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
import { buildPlanningIndex } from './planning/indexer'
import { listBackups, createBackup, restoreBackup } from './backup'
import { getDatabasePath, logActivity, getSetting, setSettingValue, listRecentActivity } from './storage/projectsStore'
import { IPC_EVENTS } from '../shared/preload/api'
import { watchPlanningForWindow } from './planning/watcher'
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

const emitPlanningIndexUpdate = async (window: BrowserWindow | null, projectPath: string) => {
  if (!window) return
  const result = await buildPlanningIndex(projectPath)
  window.webContents.send(IPC_EVENTS.PLANNING_INDEX_UPDATED, result)
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
    logActivity('project.select', { projectPath })

    if (browserWindow) {
      watchPlanningForWindow(browserWindow, projectPath, async () => {
        await emitPlanningIndexUpdate(browserWindow, projectPath)
      })

      await emitPlanningIndexUpdate(browserWindow, projectPath)
    }

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
    logActivity('planning.readme.write', { projectPath: payload.projectPath })
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
    logActivity('project.metadata.save', { projectPath: data.projectPath })

    return { success: true }
  })

  registerIpcHandler(IPC_CHANNELS.PLANNING_INDEX, async (_event, payload) => {
    return buildPlanningIndex(payload.projectPath)
  })

  registerIpcHandler(IPC_CHANNELS.PLANNING_UPDATE_STATUS, async (_event, payload) => {
    const { readFile, writeFile } = await import('node:fs/promises')
    const matter = (await import('gray-matter')).default
    const raw = await readFile(payload.path, 'utf-8')
    const parsed = matter(raw)
    parsed.data.status = payload.status
    const updated = matter.stringify(parsed.content, parsed.data)
    await writeFile(payload.path, updated, 'utf-8')
    logActivity('planning.status.update', { path: payload.path, status: payload.status })
    return { success: true }
  })

  registerIpcHandler(IPC_CHANNELS.BACKUP_LIST, async (_event, payload) => {
    const planningPath = resolvePlanningDir(payload.projectPath)
    const entries = await listBackups(payload.projectPath)
    return { entries, planningPath }
  })

  registerIpcHandler(IPC_CHANNELS.BACKUP_CREATE, async (_event, payload) => {
    const planningPath = resolvePlanningDir(payload.projectPath)
    const dbPath = getDatabasePath()
    const result = await createBackup(payload.projectPath, planningPath, dbPath)
    logActivity('backup.create', { projectPath: payload.projectPath, id: result.id })
    return result
  })

  registerIpcHandler(IPC_CHANNELS.BACKUP_RESTORE, async (_event, payload) => {
    const planningPath = resolvePlanningDir(payload.projectPath)
    const dbPath = getDatabasePath()
    const result = await restoreBackup(payload.projectPath, payload.id, planningPath, dbPath)
    logActivity('backup.restore', { projectPath: payload.projectPath, id: payload.id })
    return result
  })

  registerIpcHandler(IPC_CHANNELS.SETTINGS_GET, async (_event, payload) => {
    const value = getSetting(payload.key)
    return { value }
  })

  registerIpcHandler(IPC_CHANNELS.SETTINGS_SET, async (_event, payload) => {
    setSettingValue(payload.key, payload.value)
    logActivity('settings.set', { key: payload.key })
    return { success: true }
  })

  registerIpcHandler(IPC_CHANNELS.ACTIVITY_LIST, async (_event, payload) => {
    const entries = listRecentActivity(payload.limit ?? 10)
    return { entries }
  })
}
