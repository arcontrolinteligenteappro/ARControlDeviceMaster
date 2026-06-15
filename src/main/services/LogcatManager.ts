// src/main/services/LogcatManager.ts
import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

export class LogcatManager extends EventEmitter {
  private static activeProcesses: Map<string, ChildProcess> = new Map();

  static startCapture(
    deviceId: string,
    onData: (logLine: string) => void,
  ): boolean {
    if (this.activeProcesses.has(deviceId)) return true;

    try {
      console.log(`[Forense] Abriendo volcado Logcat para: ${deviceId}`);

      const args = ['-s', deviceId, 'logcat', '-v', 'time', '*:V'];
      const logcatProcess = spawn('adb', args);

      logcatProcess.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          if (line.trim()) onData(line);
        }
      });

      logcatProcess.on('close', () => {
        console.log(`[Forense] Captura de logs terminada para ${deviceId}`);
        this.activeProcesses.delete(deviceId);
      });

      this.activeProcesses.set(deviceId, logcatProcess);
      return true;
    } catch (error) {
      console.error(
        `[Forense ERROR] Error crítico en el stream logcat:`,
        error,
      );
      return false;
    }
  }

  static stopCapture(deviceId: string): void {
    const process = this.activeProcesses.get(deviceId);
    if (process) {
      process.kill();
      this.activeProcesses.delete(deviceId);
      console.log(`[Forense] Proceso logcat purgado para ${deviceId}`);
    }
  }
}
