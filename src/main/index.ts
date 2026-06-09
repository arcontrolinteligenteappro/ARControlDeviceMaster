import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { setupMultiControlIPC } from './ipc/multicontrol';

// FASE 4: ANTI-BRICK (Bloqueo de aceleración para evitar GPU Crash)
app.disableHardwareAcceleration();

function createWindow(): void {
    const mainWindow = new BrowserWindow({
        width: 1440,
        height: 900,
        backgroundColor: '#02050A',
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            contextIsolation: true,
            nodeIntegration: false, // Seguridad estricta
        }
    });

    mainWindow.setMenuBarVisibility(false);

    // Inicialización del Enrutador IPC (Dominios)
    setupMultiControlIPC();
    // setupForensicIPC(); // Se activará en la Fase 11
    // setupTelecomIPC();  // Se activará en la Fase 10

    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
    } else {
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});