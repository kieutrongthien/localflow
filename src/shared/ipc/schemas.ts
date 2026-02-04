import { z } from 'zod'

export const IPC_CHANNELS = {
  GET_VERSION: 'system:getVersion'
} as const

export type IpcChannel = (typeof IPC_CHANNELS)[keyof typeof IPC_CHANNELS]

const schemaMap = {
  [IPC_CHANNELS.GET_VERSION]: z.undefined().optional()
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
