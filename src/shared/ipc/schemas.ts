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
  DB_PATH: 'db:path',
  PLANNING_EXPORT_JSON: 'planning:export-json',
  PLANNING_IMPORT_JSON: 'planning:import-json'
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
  [IPC_CHANNELS.DB_PATH]: z.undefined().optional(),
  [IPC_CHANNELS.PLANNING_EXPORT_JSON]: metadataPayload,
  [IPC_CHANNELS.PLANNING_IMPORT_JSON]: metadataPayload
} as const satisfies Record<IpcChannel, z.ZodTypeAny>

// Update feed (internal)
export const UPDATE_CHANNELS = {
  UPDATE_CHECK: 'update:check'
} as const

export type UpdateChannel = (typeof UPDATE_CHANNELS)[keyof typeof UPDATE_CHANNELS]

const updateSchemaMap = {
  [UPDATE_CHANNELS.UPDATE_CHECK]: z.object({ feedPath: z.string().optional() })
} as const satisfies Record<UpdateChannel, z.ZodTypeAny>

export type UpdatePayloadFor<T extends UpdateChannel> = z.infer<(typeof updateSchemaMap)[T]>

// Save planning item (frontmatter write)
export const EDIT_CHANNELS = {
  PLANNING_SAVE_ITEM: 'planning:save-item'
} as const

export type EditChannel = (typeof EDIT_CHANNELS)[keyof typeof EDIT_CHANNELS]

export const saveItemPayload = z.object({
  path: z.string(),
  data: z.object({
    title: z.string().min(1),
    status: z.string().optional(),
    priority: z.string().optional(),
    points: z.number().nullable().optional(),
    owner: z.string().optional(),
    assignee: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
})

// Planning file read (safe)
export const PLANNING_READ_FILE = 'planning:read-file' as const
export const planningReadFilePayload = z.object({ path: z.string().min(1) })

// Release notes generate
export const RELEASE_NOTES_GENERATE = 'release:notes:generate' as const
export const releaseNotesPayload = z.object({ projectPath: z.string().min(1), limit: z.number().int().positive().max(200).optional() })

// Settings helpers (batch)
export const SETTINGS_CHANNELS = {
  SETTINGS_GET_MANY: 'settings:get-many',
  SETTINGS_SET_MANY: 'settings:set-many'
} as const

export type SettingsChannel = (typeof SETTINGS_CHANNELS)[keyof typeof SETTINGS_CHANNELS]

export const settingsGetManyPayload = z.object({ keys: z.array(z.string().min(1)) })
export const settingsGetManyResult = z.object({ values: z.record(z.string(), z.string().nullable()) })

export const settingsSetManyPayload = z.object({ kv: z.record(z.string(), z.string()) })
export const settingsSetManyResult = z.object({ success: z.boolean() })

type SchemaFor<T extends IpcChannel> = (typeof schemaMap)[T]

export const allowedChannels = [
  ...Object.values(IPC_CHANNELS),
  ...Object.values(SETTINGS_CHANNELS),
  PLANNING_READ_FILE,
  RELEASE_NOTES_GENERATE,
  EDIT_CHANNELS.PLANNING_SAVE_ITEM,
  UPDATE_CHANNELS.UPDATE_CHECK
]

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
