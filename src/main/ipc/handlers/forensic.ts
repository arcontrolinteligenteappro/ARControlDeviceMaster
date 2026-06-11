// src/main/ipc/handlers/forensic.ts
import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Worker } from 'worker_threads';
import path from 'path';

// Resolve the worker path once
const forensicWorkerPath = path.resolve(__dirname, '../workers/forensic.worker.js');

// --- IPC HANDLER FOR FORENSIC OPERATIONS ---

ipcMain.handle('forensic:run-operation', async (_event: IpcMainInvokeEvent, deviceId: string, operation: 'sqlite-carving' | 'file-carving', params: any) => {
    console.log(`[IPC] Received forensic operation '${operation}' for device ${deviceId}`);

    return new Promise((resolve, reject) => {
        const worker = new Worker(forensicWorkerPath, {
            workerData: { 
                deviceId,
                operation,
                ...params
            }
        });

        worker.on('message', (result) => {
            if (result.success) {
                console.log(`[IPC] Forensic worker completed successfully for device ${deviceId}`);
                resolve(result.data);
            } else {
                console.error(`[IPC] Forensic worker failed for device ${deviceId}: ${result.error}`);
                reject(new Error(result.error));
            }
        });

        worker.on('error', (err) => {
            console.error(`[IPC] Forensic worker crashed for device ${deviceId}: ${err.message}`);
            reject(err);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                const errorMessage = `[IPC] Forensic worker stopped with exit code ${code} for device ${deviceId}`;
                console.error(errorMessage);
                // The promise might have already been rejected, but this is a fallback.
                reject(new Error(errorMessage));
            }
        });

        // Post the initial message to start the worker's task
        worker.postMessage({ 
            deviceId,
            operation,
            ...params
        });
    });
});
