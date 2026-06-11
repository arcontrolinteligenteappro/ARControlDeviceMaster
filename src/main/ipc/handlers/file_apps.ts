// src/main/ipc/handlers/file_apps.ts
import { ipcMain } from 'electron';
import RootExplorer from '../../modules/file/RootExplorer';
import ApkManager from '../../modules/apps/ApkManager';

export function registerFileAppHandlers() {
    // File Operations
    ipcMain.handle('file:list', async (_event, deviceSerial: string, path: string) => {
        return await RootExplorer.listDirectory(deviceSerial, path);
    });

    ipcMain.handle('file:push', async (_event, deviceSerial: string, localPath: string, remotePath: string) => {
        return await RootExplorer.pushFile(deviceSerial, localPath, remotePath);
    });

    ipcMain.handle('file:pull', async (_event, deviceSerial: string, remotePath: string, localPath: string) => {
        return await RootExplorer.pullFile(deviceSerial, remotePath, localPath);
    });

    ipcMain.handle('file:chmod', async (_event, deviceSerial: string, path: string, permissions: string) => {
        return await RootExplorer.setPermissions(deviceSerial, path, permissions);
    });

    ipcMain.handle('file:chown', async (_event, deviceSerial: string, path: string, owner: string) => {
        return await RootExplorer.setOwner(deviceSerial, path, owner);
    });

    // App Operations
    ipcMain.handle('app:install', async (_event, deviceSerial: string, apkPath: string) => {
        return await ApkManager.install(deviceSerial, apkPath);
    });

    ipcMain.handle('app:uninstall', async (_event, deviceSerial: string, packageName: string) => {
        return await ApkManager.uninstall(deviceSerial, packageName);
    });

    ipcMain.handle('app:extract', async (_event, deviceSerial: string, packageName: string, destinationPath: string) => {
        return await ApkManager.extract(deviceSerial, packageName, destinationPath);
    });
}
