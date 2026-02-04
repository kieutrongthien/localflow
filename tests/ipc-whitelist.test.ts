import { describe, expect, it } from 'vitest'
import { IPC_CHANNELS, allowedChannels, validateIpcPayload } from '../src/shared/ipc/schemas'

describe('IPC whitelist + validator', () => {
  it('lists known channels only', () => {
    expect(allowedChannels).toContain(IPC_CHANNELS.GET_VERSION)
  })

  it('accepts undefined payload for getVersion', () => {
    expect(() => validateIpcPayload(IPC_CHANNELS.GET_VERSION, undefined)).not.toThrow()
  })

  it('rejects unexpected payload shape', () => {
    expect(() => validateIpcPayload(IPC_CHANNELS.GET_VERSION, { foo: 'bar' })).toThrow()
  })
})
