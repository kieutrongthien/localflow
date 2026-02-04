import type { LocalflowBridge } from '../../shared/preload/api'

declare global {
  interface Window {
    localflow: LocalflowBridge
  }
}

export {}
