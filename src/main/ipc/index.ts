// src/main/ipc/index.ts
import { ipcMain } from 'electron';
import { registerSystemHandlers } from './handlers/system';
import { registerControlHandlers } from './handlers/control';
import { registerFileAppHandlers } from './handlers/file_apps';

export function initializeIpcHandlers() {
    registerSystemHandlers();
    registerControlHandlers();
    registerFileAppHandlers();
    console.log('[IPC] All handlers registered.');
}
