import { z } from 'zod'

export const IPC_CHANNELS = {
  GET_VERSION: 'system:getVersion',
  SELECT_PROJECT_ROOT: 'workspace:select-root',
  READ_PLANNING_README: 'planning:read-readme',
  WRITE_PLANNING_README: 'planning:write-readme',
  GET_PROJECT_METADATA: 'project:get-metadata',
  SAVE_PROJECT_METADATA: 'project:save-metadata',
  PLANNING_INDEX: 'planning:index'
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
  [IPC_CHANNELS.PLANNING_INDEX]: metadataPayload
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
