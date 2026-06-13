import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { IpcManager } from './ipc/IpcManager';
import { gamingManager } from './modules/gaming/GamingManager'; // 1. Importar GamingManager

class Main {
  private mainWindow: BrowserWindow | null = null;
  private ipcManager: IpcManager;

  constructor() {
    this.ipcManager = new IpcManager();

    // 2. Hacer la promesa asíncrona y esperar la inicialización
    app.whenReady().then(async () => {
      await gamingManager.init(); // <- Inicializar el GamingManager

      this.createWindow();
      this.ipcManager.registerAllHandlers();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit();
      }
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1280,
      height: 720,
      backgroundColor: '#000',
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        contextIsolation: true,
        nodeIntegration: false,
      },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      this.mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
      this.mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }

    // Este cambio de estado simulado puede ser eliminado más adelante
    setTimeout(() => {
      this.mainWindow?.webContents.send('app-state-change', 'Disconnected');
    }, 5000);
  }
}

new Main();
