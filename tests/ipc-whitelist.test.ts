import { describe, expect, it } from 'vitest'
import { IPC_CHANNELS, allowedChannels, validateIpcPayload } from '../src/shared/ipc/schemas'

describe('IPC whitelist + validator', () => {
  it('whitelists expected channels', () => {
    expect(allowedChannels).toEqual(
      expect.arrayContaining([
        IPC_CHANNELS.GET_VERSION,
        IPC_CHANNELS.SELECT_PROJECT_ROOT,
        IPC_CHANNELS.READ_PLANNING_README,
        IPC_CHANNELS.WRITE_PLANNING_README
      ])
    )
  })

  it('accepts undefined payloads for version + select root', () => {
    expect(() => validateIpcPayload(IPC_CHANNELS.GET_VERSION, undefined)).not.toThrow()
    expect(() => validateIpcPayload(IPC_CHANNELS.SELECT_PROJECT_ROOT, undefined)).not.toThrow()
  })

  it('validates read planning payload', () => {
    expect(() =>
      validateIpcPayload(IPC_CHANNELS.READ_PLANNING_README, { projectPath: '/tmp/demo' })
    ).not.toThrow()

    expect(() => validateIpcPayload(IPC_CHANNELS.READ_PLANNING_README, {})).toThrow()
  })

  it('validates write planning payload', () => {
    expect(() =>
      validateIpcPayload(IPC_CHANNELS.WRITE_PLANNING_README, {
        projectPath: '/tmp/demo',
        content: '# Hello'
      })
    ).not.toThrow()

    expect(() => validateIpcPayload(IPC_CHANNELS.WRITE_PLANNING_README, { projectPath: '' })).toThrow()
  })
})
