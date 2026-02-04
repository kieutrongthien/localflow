import { describe, expect, it } from 'vitest'
import { IPC_CHANNELS, allowedChannels, validateIpcPayload } from '../src/shared/ipc/schemas'

describe('IPC whitelist + validator', () => {
  it('whitelists expected channels', () => {
    expect(allowedChannels).toEqual(
      expect.arrayContaining([
        IPC_CHANNELS.GET_VERSION,
        IPC_CHANNELS.SELECT_PROJECT_ROOT,
        IPC_CHANNELS.READ_PLANNING_README,
        IPC_CHANNELS.WRITE_PLANNING_README,
        IPC_CHANNELS.GET_PROJECT_METADATA,
        IPC_CHANNELS.SAVE_PROJECT_METADATA,
        IPC_CHANNELS.PLANNING_INDEX
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

  it('validates project metadata payloads', () => {
    expect(() =>
      validateIpcPayload(IPC_CHANNELS.GET_PROJECT_METADATA, { projectPath: '/tmp/demo' })
    ).not.toThrow()

    expect(() =>
      validateIpcPayload(IPC_CHANNELS.SAVE_PROJECT_METADATA, {
        projectPath: '/tmp/demo',
        name: 'LocalFlow',
        description: 'Demo',
        team: ['A', 'B'],
        startDate: '2026-02-05',
        endDate: '2026-03-01'
      })
    ).not.toThrow()

    expect(() =>
      validateIpcPayload(IPC_CHANNELS.SAVE_PROJECT_METADATA, {
        projectPath: '',
        name: '',
        description: '',
        team: [],
        startDate: '',
        endDate: ''
      })
    ).toThrow()
  })

  it('validates planning index payload', () => {
    expect(() =>
      validateIpcPayload(IPC_CHANNELS.PLANNING_INDEX, { projectPath: '/tmp/demo' })
    ).not.toThrow()
    expect(() => validateIpcPayload(IPC_CHANNELS.PLANNING_INDEX, {})).toThrow()
  })
})
