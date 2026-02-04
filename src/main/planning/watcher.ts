import chokidar from 'chokidar'
import type { BrowserWindow } from 'electron'
import path from 'node:path'

const watchers = new Map<number, { watcher: chokidar.FSWatcher; debounce?: NodeJS.Timeout }>()

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

  watchers.set(windowId, { watcher })
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
