import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { exec } from 'child_process';
import util from 'util';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { AdbService } from './services/AdbService';
import { ScrcpyManager } from './services/ScrcpyManager';
import { IpcChannels } from '../shared/ipc-types';

const execAsync = util.promisify(exec);
let mainWindow: BrowserWindow | null = null;
let telemetryInterval: NodeJS.Timeout | null = null;

const BIN_PATH = is.dev
  ? join(__dirname, '../../resources/bin')
  : join(process.resourcesPath, 'bin');

const ADB_PATH = join(BIN_PATH, 'adb.exe');

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    startTelemetryStream();
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

function registerIpcHandlers(): void {
  ipcMain.handle(
    IpcChannels.ADB_GET_DEVICES,
    async () => await AdbService.getConnectedDevices(),
  );

  ipcMain.handle('capture-screenshot', async (_, id: string) => {
    try {
      const path = join(
        app.getPath('documents'),
        `cap_${id}_${Date.now()}.png`,
      );
      await execAsync(
        `"${ADB_PATH}" -s ${id} shell screencap -p /sdcard/screen.png && "${ADB_PATH}" -s ${id} pull /sdcard/screen.png "${path}"`,
      );
      return { success: true, path };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('forensic-start', async (_, id: string) => {
    try {
      const path = join(
        app.getPath('downloads'),
        `logs_${id}_${Date.now()}.txt`,
      );
      await execAsync(`"${ADB_PATH}" -s ${id} logcat -d > "${path}"`);
      return { success: true, path };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reboot-device', async (_, id: string) => {
    try {
      await execAsync(`"${ADB_PATH}" -s ${id} reboot`);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle(IpcChannels.SCRCPY_START, async (_, id) =>
    ScrcpyManager.startStream(id),
  );
  ipcMain.handle(IpcChannels.SCRCPY_STOP, async (_, id) =>
    ScrcpyManager.stopStream(id),
  );
}

function startTelemetryStream(): void {
  if (telemetryInterval) clearInterval(telemetryInterval);
  telemetryInterval = setInterval(async () => {
    try {
      const devices = await AdbService.getConnectedDevices();
      mainWindow?.webContents.send(IpcChannels.TELEMETRY_STREAM, devices);
    } catch (error) {
      console.error('Telemetry error:', error);
    }
  }, 2000);
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.arcontrolinteligente.devicemaster');
  registerIpcHandlers();
  createWindow();
});

app.on('will-quit', () => {
  if (telemetryInterval) clearInterval(telemetryInterval);
});
