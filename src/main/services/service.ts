// src/main/services/AdbService.ts
import { exec } from 'child_process';
import util from 'util';
import { DeviceTelemetry } from '../../shared/ipc-types';

const execAsync = util.promisify(exec);

export class AdbService {
  // 1. Barrido y lectura de dispositivos conectados
  static async getConnectedDevices(): Promise<DeviceTelemetry[]> {
    try {
      const { stdout } = await execAsync('adb devices -l');
      const lines = stdout.split('\n').slice(1); // Ignorar la primera línea
      const devices: DeviceTelemetry[] = [];

      for (const line of lines) {
        if (line.trim() === '') continue;

        const [id, state, ...info] = line.trim().split(/\s+/);
        if (state === 'offline') continue;

        const modelInfo = info.find((i) => i.startsWith('model:'));
        const model = modelInfo ? modelInfo.split(':')[1] : 'Unknown Device';

        // Detección táctica: Si tiene puerto, es WiFi. Si no, es USB.
        const isWiFi = id.includes(':5555') || id.match(/\d+\.\d+\.\d+\.\d+/);

        devices.push({
          id,
          model,
          connection: isWiFi ? 'WiFi' : 'USB',
          state,
          // Valores por defecto (se actualizarán con la telemetría en vivo después)
          rootStatus: false,
          knoxGuard: 'Checking...',
        });
      }
      return devices;
    } catch (error: any) {
      console.error('[ADB ERROR] Falla al listar dispositivos:', error.message);
      return [];
    }
  }

  // 2. Inyección Manual TCP/IP
  static async connectManual(ip: string, port: string): Promise<boolean> {
    try {
      console.log(`[Motor ADB] Ejecutando puente táctico hacia ${ip}:${port}`);
      const { stdout } = await execAsync(`adb connect ${ip}:${port}`);
      return stdout.includes('connected to');
    } catch (error) {
      return false;
    }
  }

  // 3. Reinicio del Daemon ADB
  static async restartDaemon(): Promise<void> {
    try {
      await execAsync('adb kill-server');
      await execAsync('adb start-server');
      console.log('[Motor ADB] Daemon reiniciado y operativo.');
    } catch (error: any) {
      console.error('[ADB ERROR] Falla mortal en el Daemon:', error.message);
    }
  }
}
