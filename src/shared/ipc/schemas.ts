import { z } from 'zod'

export const IPC_CHANNELS = {
  GET_VERSION: 'system:getVersion',
  SELECT_PROJECT_ROOT: 'workspace:select-root',
  READ_PLANNING_README: 'planning:read-readme',
  WRITE_PLANNING_README: 'planning:write-readme'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]

const schemaMap = {
  [IPC_CHANNELS.GET_VERSION]: z.undefined().optional(),
  [IPC_CHANNELS.SELECT_PROJECT_ROOT]: z.undefined().optional(),
  [IPC_CHANNELS.READ_PLANNING_README]: z.object({
    projectPath: z.string().min(1)
  }),
  [IPC_CHANNELS.WRITE_PLANNING_README]: z.object({
    projectPath: z.string().min(1),
    content: z.string()
  })
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
