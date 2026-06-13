// src/main/ipc/IpcManager.ts
import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { deviceManager } from '../core/DeviceManager';
import { scrcpyManager } from '../modules/control/ScrcpyManager';
import { gamingManager } from '../modules/gaming/GamingManager';

export class IpcManager {
  private telemetryWorkers = new Map<string, Worker>();

  constructor() {
    console.log('[IPC] IpcManager initialized.');
  }

  public registerAllHandlers() {
    this.registerSystemHandlers();
    this.registerControlHandlers();
    this.registerFileAppHandlers();
    this.registerGamingHandlers();
    console.log('[IPC] All handlers registered.');
  }

  private registerSystemHandlers() {
    // Handler to get device list, returns a promise with the device array
    ipcMain.handle('sys:get-devices', async () => {
      return await deviceManager.getConnectedDevices();
    });

    // Handler to start a telemetry worker for a given deviceId
    ipcMain.on(
      'sys:start-telemetry',
      (event: IpcMainEvent, deviceId: string) => {
        if (this.telemetryWorkers.has(deviceId)) {
          console.warn(
            `[IPC] Telemetry worker for ${deviceId} is already running.`,
          );
          return;
        }

        // Note: The path must be relative to the output directory at runtime.
        const workerPath = path.join(
          __dirname,
          '../workers/telemetry.worker.js',
        );
        const worker = new Worker(workerPath, { workerData: { deviceId } });

        this.telemetryWorkers.set(deviceId, worker);
        console.log(`[IPC] Telemetry worker started for device: ${deviceId}`);

        worker.on('message', (data) => {
          const window = BrowserWindow.fromWebContents(event.sender);
          // Ensure window is still valid before sending
          if (window && !window.isDestroyed()) {
            // Channel: 'telemetry:update', Payload: { deviceId, ...data }
            window.webContents.send('telemetry:update', { deviceId, ...data });
          }
        });

        worker.on('error', (err) => {
          console.error(`[TelemetryWorker:${deviceId}] crashed:`, err);
          this.telemetryWorkers.delete(deviceId); // Clean up on error
        });

        worker.on('exit', (code) => {
          this.telemetryWorkers.delete(deviceId); // Clean up on exit
          if (code !== 0) {
            console.warn(
              `[TelemetryWorker:${deviceId}] stopped with non-zero exit code: ${code}`,
            );
          }
        });
      },
    );

    // Handler to explicitly stop a telemetry worker
    ipcMain.on(
      'sys:stop-telemetry',
      (_event: IpcMainEvent, deviceId: string) => {
        const worker = this.telemetryWorkers.get(deviceId);
        if (worker) {
          worker.terminate();
          console.log(
            `[IPC] Terminated telemetry worker for device: ${deviceId}`,
          );
        }
      },
    );
  }

  private registerControlHandlers() {
    ipcMain.on('start-mirroring', (_, deviceId: string) => {
      if (!deviceId) {
        console.error(
          '[IPC] Received start-mirroring request without a deviceId.',
        );
        return;
      }
      console.log(`[IPC] Received request to start mirroring for ${deviceId}`);
      scrcpyManager.start(deviceId, { turnScreenOff: true, stayAwake: true });
    });

    ipcMain.on('stop-mirroring', (_, deviceId: string) => {
      if (!deviceId) {
        console.error(
          '[IPC] Received stop-mirroring request without a deviceId.',
        );
        return;
      }
      console.log(`[IPC] Received request to stop mirroring for ${deviceId}`);
      scrcpyManager.stop(deviceId);
    });
  }

  private registerFileAppHandlers() {
    // This will handle file, app, and backup operations.
    // Example handler (to be implemented)
    ipcMain.on('list-files', (_, { deviceId, path }) => {
      console.log(
        `[IPC] Received list-files request for ${deviceId} at path ${path}`,
      );
      // Here we would call a service to interact with ADB fs
    });

    console.log('[IPC] File and App handlers registered.');
  }

  private registerGamingHandlers() {
    ipcMain.on('start-gaming-session', (_, deviceId: string) => {
      gamingManager.startSession(deviceId);
    });
    ipcMain.on('stop-gaming-session', (_, deviceId: string) => {
      gamingManager.stopSession(deviceId);
    });
    ipcMain.on('gaming-input', (_, { deviceId, input }) => {
      gamingManager.sendInput(deviceId, input);
    });
    ipcMain.on('update-key-mappings', (_, { deviceId, mappings }) => {
      gamingManager.updateWorkerMappings(deviceId, mappings);
    });

    ipcMain.handle('keymap:save-profile', (_, { profileName, mappings }) =>
      gamingManager.saveProfile(profileName, mappings),
    );
    ipcMain.handle('keymap:load-profile', (_, profileName: string) =>
      gamingManager.loadProfile(profileName),
    );
    ipcMain.handle('keymap:list-profiles', () => gamingManager.listProfiles());
    console.log('[IPC] Gaming handlers registered.');
  }
}
