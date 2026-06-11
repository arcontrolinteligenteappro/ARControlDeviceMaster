// src/main/index.ts
import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import icon from '../../src/renderer/src/assets/icono.png?asset'
import { SyncServer } from './modules/bridge/SyncServer'
import { deviceManager } from './modules/devices/DeviceManager'

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1024,
    show: false,
    backgroundColor: '#02050A',
    icon: icon,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  const syncServerInstance = new SyncServer()
  deviceManager.init(syncServerInstance)
  
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
