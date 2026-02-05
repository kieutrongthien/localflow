import { z } from 'zod'

export const IPC_CHANNELS = {
  GET_VERSION: 'system:getVersion',
  SELECT_PROJECT_ROOT: 'workspace:select-root',
  READ_PLANNING_README: 'planning:read-readme',
  WRITE_PLANNING_README: 'planning:write-readme',
  GET_PROJECT_METADATA: 'project:get-metadata',
  SAVE_PROJECT_METADATA: 'project:save-metadata',
  PLANNING_INDEX: 'planning:index',
  PLANNING_UPDATE_STATUS: 'planning:update-status',
  BACKUP_LIST: 'backup:list',
  BACKUP_CREATE: 'backup:create',
  BACKUP_RESTORE: 'backup:restore',
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
  ACTIVITY_LIST: 'activity:list',
  DB_PATH: 'db:path'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]

const metadataPayload = z.object({
  projectPath: z.string().min(1)
})

const metadataSavePayload = metadataPayload.extend({
  name: z.string().min(1, 'Tên dự án bắt buộc'),
  description: z.string().min(1, 'Mô tả bắt buộc'),
  team: z.array(z.string().min(1)).default([]),
  startDate: z.string().min(1, 'Ngày bắt đầu bắt buộc'),
  endDate: z.string().min(1, 'Ngày kết thúc bắt buộc')
})

const schemaMap = {
  [IPC_CHANNELS.GET_VERSION]: z.undefined().optional(),
  [IPC_CHANNELS.SELECT_PROJECT_ROOT]: z.undefined().optional(),
  [IPC_CHANNELS.READ_PLANNING_README]: metadataPayload,
  [IPC_CHANNELS.WRITE_PLANNING_README]: metadataPayload.extend({
    content: z.string()
  }),
  [IPC_CHANNELS.GET_PROJECT_METADATA]: metadataPayload,
  [IPC_CHANNELS.SAVE_PROJECT_METADATA]: metadataSavePayload,
  [IPC_CHANNELS.PLANNING_INDEX]: metadataPayload,
  [IPC_CHANNELS.PLANNING_UPDATE_STATUS]: z.object({ path: z.string().min(1), status: z.string().min(1) }),
  [IPC_CHANNELS.BACKUP_LIST]: metadataPayload,
  [IPC_CHANNELS.BACKUP_CREATE]: metadataPayload,
  [IPC_CHANNELS.BACKUP_RESTORE]: metadataPayload.extend({ id: z.string().min(1) }),
  [IPC_CHANNELS.SETTINGS_GET]: z.object({ key: z.string().min(1) }),
  [IPC_CHANNELS.SETTINGS_SET]: z.object({ key: z.string().min(1), value: z.string() }),
  [IPC_CHANNELS.ACTIVITY_LIST]: z.object({ limit: z.number().min(1).max(100).default(10) }),
  [IPC_CHANNELS.DB_PATH]: z.undefined().optional()
} as const satisfies Record<IpcChannel, z.ZodTypeAny>

type SchemaFor<T extends IpcChannel> = (typeof schemaMap)[T]

export const allowedChannels = Object.values(IPC_CHANNELS)

export const validateIpcPayload = <T extends IpcChannel>(channel: T, payload: unknown) => {
  const schema = schemaMap[channel]

  if (!schema) {
    throw new Error(`IPC channel ${channel} is not registered`)
  }

  return schema.parse(payload) as z.infer<SchemaFor<T>>
}

export type PayloadFor<T extends IpcChannel> = z.infer<SchemaFor<T>>
export type GetProjectMetadataPayload = z.infer<typeof metadataPayload>
export type SaveProjectMetadataPayload = z.infer<typeof metadataSavePayload>
export type PlanningIndexPayload = z.infer<typeof metadataPayload>
export type SettingsGetPayload = z.infer<typeof schemaMap[typeof IPC_CHANNELS.SETTINGS_GET]>
export type SettingsSetPayload = z.infer<typeof schemaMap[typeof IPC_CHANNELS.SETTINGS_SET]>
