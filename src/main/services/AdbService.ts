// src/main/services/AdbService.ts
import { Adb } from '@devicefarmer/adbkit';
import { DeviceTelemetry } from '../../shared/ipc-types';

const client = Adb.createClient();

export class AdbService {
  static async getConnectedDevices(): Promise<DeviceTelemetry[]> {
    try {
      const adbDevices = await client.listDevices();
      const devices: DeviceTelemetry[] = [];

      for (const dev of adbDevices) {
        let model = 'Dispositivo Desconocido';
        let connection: 'USB' | 'WiFi' | 'Offline' = 'Offline';

        if (dev.type === 'device') {
          try {
            const props = await client.getProperties(dev.id);
            model = props['ro.product.model'] || model;
          } catch (e) {
            console.warn(
              '[AdbService] No se pudieron obtener las propiedades de ',
            );
          }
        }

        connection =
          dev.id.includes(':') || dev.id.includes('.') ? 'WiFi' : 'USB';

        devices.push({
          id: dev.id,
          model,
          connection,
          state: dev.type === 'device' ? 'ONLINE' : dev.type.toUpperCase(),
        });
      }

      return devices;
    } catch (error: any) {
      console.error(
        '[AdbService ERROR] Falla al escanear radar ADB:',
        error.message,
      );
      return [];
    }
  }

  static async connectManual(ip: string, port: string): Promise<boolean> {
    try {
      console.log('[AdbService] Ejecutando inyección táctica hacia :');
      await client.connect(ip, parseInt(port, 10));
      return true;
    } catch (error: any) {
      console.error('[AdbService ERROR] Conexión rechazada:', error.message);
      return false;
    }
  }

  static getClient(): any {
    return client;
  }
}
