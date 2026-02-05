import { getSetting, setSettingValue } from './projectsStore'

const cache = new Map<string, string | null>()

export const settingsGet = (key: string): string | null => {
  if (cache.has(key)) return cache.get(key) ?? null
  const val = getSetting(key)
  cache.set(key, val)
  return val
}

export const settingsSet = (key: string, value: string) => {
  setSettingValue(key, value)
  cache.set(key, value)
}

export const settingsGetMany = (keys: string[]) => {
  const out: Record<string, string | null> = {}
  for (const k of keys) {
    out[k] = settingsGet(k)
  }
  return out
}

export const settingsSetMany = (kv: Record<string, string>) => {
  for (const [k, v] of Object.entries(kv)) settingsSet(k, v)
}

