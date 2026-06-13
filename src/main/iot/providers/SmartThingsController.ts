import {
  SmartThingsClient,
  BearerTokenAuthenticator,
} from '@smartthings/core-sdk';
import { configManager } from '../../config/ConfigManager';

export class SmartThingsController {
  private client: SmartThingsClient;
  private isConfigured = false;

  constructor() {
    const stConfig = configManager.getIotConfig().smartthings;

    if (stConfig && stConfig.apiKey) {
      this.client = new SmartThingsClient(
        new BearerTokenAuthenticator(stConfig.apiKey),
      );
      this.isConfigured = true;
      console.log('[STController] Controlador de SmartThings configurado.');
    } else {
      console.warn(
        '[STController] API Key de SmartThings no encontrada en config.json. El controlador no funcionará.',
      );
    }
  }

  async getDevices(): Promise<any[]> {
    if (!this.isConfigured) return [];

    try {
      const devices = await this.client.devices.list();
      console.log(`[STController] Encontrados ${devices.length} dispositivos.`);
      // Mapeamos los dispositivos para que tengan la estructura que esperamos y añadimos el proveedor.
      return devices.map((d) => ({
        id: d.deviceId,
        name: d.label,
        provider: 'smartthings',
        // Podríamos añadir más propiedades aquí si las necesitamos, como el tipo de dispositivo, etc.
      }));
    } catch (error) {
      console.error('[STController] Error al obtener los dispositivos:', error);
      return [];
    }
  }

  async setState(device: any, state: { power?: boolean }): Promise<boolean> {
    if (!this.isConfigured) return false;

    console.log(
      `[STController] Setting state for device ${device.id} to ${JSON.stringify(state)}`,
    );

    try {
      const command = {
        component: 'main',
        capability: 'switch',
        command: state.power ? 'on' : 'off',
        arguments: [],
      };

      const result = await this.client.devices.executeCommand(
        device.id,
        command,
      );
      console.log(
        `[STController] Comando ejecutado con éxito para ${device.id}. Estado:`,
        result.status,
      );

      return result.status === 'success';
    } catch (error) {
      console.error(
        `[STController] Fallo al establecer el estado para el dispositivo ${device.id}:`,
        error,
      );
      return false;
    }
  }
}
