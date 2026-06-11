// src/main/ipc/handlers/control.ts
import { ipcMain } from 'electron';
import ScrcpyManager from '../../modules/control/ScrcpyManager';
import InputEmulation from '../../modules/control/InputEmulation';

export function registerControlHandlers() {
    ipcMain.handle('control:start-scrcpy', async (_event, config) => {
        return ScrcpyManager.start(config);
    });

    ipcMain.handle('control:stop-scrcpy', async (_event, deviceId) => {
        ScrcpyManager.stop(deviceId);
    });

    ipcMain.on('control:open-shell', (_event, deviceId: string) => {
        InputEmulation.openShell(deviceId);
    });

    ipcMain.on('control:close-shell', (_event, deviceId: string) => {
        InputEmulation.closeShell(deviceId);
    });

    ipcMain.on('control:tap', (_event, { deviceId, x, y }) => {
        InputEmulation.tap(deviceId, x, y);
    });

    ipcMain.on('control:swipe', (_event, { deviceId, x1, y1, x2, y2, duration }) => {
        InputEmulation.swipe(deviceId, x1, y1, x2, y2, duration);
    });

    ipcMain.on('control:text', (_event, { deviceId, text }) => {
        InputEmulation.sendText(deviceId, text);
    });
}
