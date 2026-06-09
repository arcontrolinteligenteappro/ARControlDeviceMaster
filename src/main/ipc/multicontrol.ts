import { ipcMain } from 'electron';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

const activeShells = new Map<string, ChildProcessWithoutNullStreams>();

export function setupMultiControlIPC() {
    // FASE 2: MACRO BROADCASTER (Promise.all)
    ipcMain.handle('control:multiBroadcast', async (_, deviceIds: string[], command: string) => {
        if (!deviceIds || deviceIds.length === 0) return { success: false };
        const commandArgs = command.split(' ');

        const promises = deviceIds.map(deviceId => {
            return new Promise((resolve) => {
                const adbProcess = spawn('adb', ['-s', deviceId, 'shell', ...commandArgs]);
                adbProcess.on('close', (code) => resolve({ deviceId, success: code === 0 }));
                adbProcess.on('error', () => resolve({ deviceId, success: false }));
            });
        });

        const results = await Promise.all(promises);
        return { success: true, results };
    });

    // FASE 2.5: PERSISTENT SHELL STREAM (Zero-Latency Keymapping / Multitouch)
    ipcMain.handle('control:multiStream', (_, deviceIds: string[], inputCmd: string) => {
        deviceIds.forEach(deviceId => {
            let shell = activeShells.get(deviceId);
            if (!shell || shell.killed) {
                shell = spawn('adb', ['-s', deviceId, 'shell']);
                activeShells.set(deviceId, shell);
                shell.on('exit', () => activeShells.delete(deviceId));
                shell.on('error', () => activeShells.delete(deviceId));
            }
            // Inyección directa al binario de Android
            shell.stdin.write(`${inputCmd}\n`);
        });
        return true;
    });

    ipcMain.handle('control:multiClose', (_, deviceIds: string[]) => {
        deviceIds.forEach(id => {
            const shell = activeShells.get(id);
            if (shell) {
                shell.stdin.end();
                shell.kill();
                activeShells.delete(id);
            }
        });
        return true;
    });
}