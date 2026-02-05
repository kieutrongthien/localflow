import { app, BrowserWindow, globalShortcut } from 'electron'
import { disposePlanningWatcher } from './planning/watcher'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { bootIpc } from './ipc'

const preloadPath = [
  path.join(__dirname, '../preload/index.js'),
  path.join(__dirname, '../preload/index.cjs'),
  path.join(__dirname, '../preload/index.mjs')
].find(existsSync) ?? path.join(__dirname, '../preload/index.js')

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  const rendererUrl = process.env.ELECTRON_RENDERER_URL
  const isDev = !!rendererUrl

  if (isDev) {
    if (!rendererUrl) throw new Error('ELECTRON_RENDERER_URL is not set in development')
    await mainWindow.loadURL(rendererUrl)
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'))
  }
  mainWindow.on('closed', () => {
    disposePlanningWatcher(mainWindow.id)
  })

  // DevTools toggle shortcut only in development
  if (isDev) {
    const toggle = () => {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools()
      } else {
        mainWindow.webContents.openDevTools({ mode: 'detach' })
      }
    }
    // Register common shortcuts
    globalShortcut.register('CommandOrControl+Shift+I', toggle)
    globalShortcut.register('F12', toggle)
  }

}

app.whenReady().then(() => {
  bootIpc()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll()
})
