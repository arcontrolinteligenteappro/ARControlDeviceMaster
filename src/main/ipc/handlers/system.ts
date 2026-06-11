// src/main/ipc/handlers/system.ts
import { ipcMain, IpcMainEvent, BrowserWindow } from 'electron';
import { Worker } from 'worker_threads';
import * as path from 'path';
import { deviceManager } from '../../core/DeviceManager';

const telemetryWorkers = new Map<string, Worker>();

export function registerSystemHandlers() {

    // Handler to get device list, returns a promise with the device array
    ipcMain.handle('sys:get-devices', async () => {
        return await deviceManager.getConnectedDevices();
    });

    // Handler to start a telemetry worker for a given deviceId
    ipcMain.on('sys:start-telemetry', (event: IpcMainEvent, deviceId: string) => {
        if (telemetryWorkers.has(deviceId)) {
            console.warn(`[IPC] Telemetry worker for ${deviceId} is already running.`);
            return;
        }

        // Note: The path must be relative to the output directory at runtime.
        const workerPath = path.join(__dirname, '../../workers/telemetry.worker.js');
        const worker = new Worker(workerPath, { workerData: { deviceId } });

        telemetryWorkers.set(deviceId, worker);
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
            telemetryWorkers.delete(deviceId); // Clean up on error
        });

        worker.on('exit', (code) => {
            telemetryWorkers.delete(deviceId); // Clean up on exit
            if (code !== 0) {
                console.warn(`[TelemetryWorker:${deviceId}] stopped with non-zero exit code: ${code}`);
            }
        });
    });

    // Handler to explicitly stop a telemetry worker
    ipcMain.on('sys:stop-telemetry', (_event: IpcMainEvent, deviceId: string) => {
        const worker = telemetryWorkers.get(deviceId);
        if (worker) {
            worker.terminate();
            console.log(`[IPC] Terminated telemetry worker for device: ${deviceId}`);
        }
    });
}
