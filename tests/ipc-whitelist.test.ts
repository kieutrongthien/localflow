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
        IPC_CHANNELS.PLANNING_INDEX,
        IPC_CHANNELS.BACKUP_LIST,
        IPC_CHANNELS.BACKUP_CREATE,
        IPC_CHANNELS.BACKUP_RESTORE,
        IPC_CHANNELS.SETTINGS_GET,
        IPC_CHANNELS.SETTINGS_SET,
        IPC_CHANNELS.PLANNING_UPDATE_STATUS
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

  it('validates backup payloads', () => {
    expect(() => validateIpcPayload(IPC_CHANNELS.BACKUP_LIST, { projectPath: '/tmp/demo' })).not.toThrow()
    expect(() => validateIpcPayload(IPC_CHANNELS.BACKUP_CREATE, { projectPath: '/tmp/demo' })).not.toThrow()
    expect(() =>
      validateIpcPayload(IPC_CHANNELS.BACKUP_RESTORE, { projectPath: '/tmp/demo', id: '2026-02-05-12-00' })
    ).not.toThrow()
    expect(() => validateIpcPayload(IPC_CHANNELS.BACKUP_RESTORE, { projectPath: '/tmp/demo' })).toThrow()
  })

  it('validates settings payloads', () => {
    expect(() => validateIpcPayload(IPC_CHANNELS.SETTINGS_GET, { key: 'theme' })).not.toThrow()
    expect(() => validateIpcPayload(IPC_CHANNELS.SETTINGS_GET, {})).toThrow()

    expect(() => validateIpcPayload(IPC_CHANNELS.SETTINGS_SET, { key: 'theme', value: 'dark' })).not.toThrow()
    expect(() => validateIpcPayload(IPC_CHANNELS.SETTINGS_SET, { key: '' })).toThrow()
  })

  it('validates planning status update payload', () => {
    expect(() => validateIpcPayload(IPC_CHANNELS.PLANNING_UPDATE_STATUS, { path: '/tmp/demo/story.md', status: 'done' })).not.toThrow()
    expect(() => validateIpcPayload(IPC_CHANNELS.PLANNING_UPDATE_STATUS, { path: '', status: '' })).toThrow()
  })
})
