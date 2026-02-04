import { app, BrowserWindow } from 'electron'
import { disposePlanningWatcher } from './planning/watcher'
import path from 'node:path'
import { bootIpc } from './ipc'

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: true
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    await mainWindow.loadFile(path.join(__dirname, '../../dist/renderer/index.html'))
  }
  mainWindow.on('closed', () => {
    disposePlanningWatcher(mainWindow.id)
  })

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
