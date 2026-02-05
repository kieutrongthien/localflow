import chokidar from 'chokidar'
import type { BrowserWindow } from 'electron'
import path from 'node:path'

const watchers = new Map<number, { watcher: chokidar.FSWatcher; debounce?: NodeJS.Timeout; retries?: number; backoffMs?: number }>()

const WATCH_GLOBS = ['epics/**/*.md', 'stories/**/*.md', 'tasks/**/*.md']
const DEBOUNCE_MS = 300

export const watchPlanningForWindow = (
  window: BrowserWindow,
  projectPath: string,
  onChange: () => Promise<void>
) => {
  const windowId = window.id
  disposePlanningWatcher(windowId)

  const root = path.join(projectPath, '.planning')
  const watcher = chokidar.watch(WATCH_GLOBS.map((glob) => path.join(root, glob)), {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 50
    }
  })

  const schedule = () => {
    const entry = watchers.get(windowId)
    if (!entry) return

    if (entry.debounce) {
      clearTimeout(entry.debounce)
    }

    entry.debounce = setTimeout(() => {
      onChange().catch((error) => {
        console.error('[planning:watcher] onChange failed', error)
      })
    }, DEBOUNCE_MS)
  }

  watcher.on('add', schedule).on('change', schedule).on('unlink', schedule)

  // Error handling with backoff retries
  watcher.on('error', (err: any) => {
    const code = typeof err === 'object' && err ? (err.code || err.name || 'watch_error') : 'watch_error'
    try { window.webContents.send('planning:watch-error', { message: String(err), code }) } catch {}
    const entry = watchers.get(windowId)
    if (!entry) return
    const retries = (entry.retries ?? 0) + 1
    const backoffMs = Math.min((entry.backoffMs ?? 500) * 2, 30_000) // exponential up to 30s
    entry.retries = retries
    entry.backoffMs = backoffMs
    entry.watcher.close().catch(() => {})
    setTimeout(() => {
      // attempt re-watch
      try {
        watchPlanningForWindow(window, projectPath, onChange)
        window.webContents.send('planning:watch-recovered', { message: 'Watcher recovered' })
      } catch (e) {
        // if re-watch fails, keep increasing backoff
        const again = watchers.get(windowId)
        if (again) {
          again.retries = retries + 1
          again.backoffMs = Math.min(backoffMs * 2, 60_000)
        }
      }
    }, backoffMs)
  })

  watchers.set(windowId, { watcher, retries: 0, backoffMs: 500 })
}

export const disposePlanningWatcher = (windowId: number) => {
  const entry = watchers.get(windowId)
  if (!entry) return

  entry.watcher.close().catch((error: unknown) => {
    console.warn('[planning:watcher] failed to close watcher', error)
  })

  if (entry.debounce) {
    clearTimeout(entry.debounce)
  }

  watchers.delete(windowId)
}

export const disposeAllPlanningWatchers = () => {
  Array.from(watchers.keys()).forEach(disposePlanningWatcher)
}
