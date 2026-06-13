import { TuyaCloud } from '@tuyapi/cloud';
import { configManager } from '../../config/ConfigManager';

export class TuyaController {
  private api: TuyaCloud;
  private isConfigured = false;

  constructor() {
    const tuyaConfig = configManager.getIotConfig().tuya;

    if (
      tuyaConfig &&
      tuyaConfig.accessId &&
      tuyaConfig.accessKey &&
      tuyaConfig.secret
    ) {
      this.api = new TuyaCloud({
        accessId: tuyaConfig.accessId,
        accessKey: tuyaConfig.accessKey,
        secret: tuyaConfig.secret,
        region: tuyaConfig.region || 'EU',
      });
      this.isConfigured = true;
      console.log('[TuyaController] Controlador de Tuya configurado.');
    } else {
      console.warn(
        '[TuyaController] Credenciales de Tuya no encontradas en config.json. El controlador no funcionará.',
      );
    }
  }

  async getDevices(): Promise<any[]> {
    if (!this.isConfigured) return [];

    try {
      const devices = await this.api.getDevices();
      console.log(
        `[TuyaController] Encontrados ${devices.length} dispositivos.`,
      );
      // Añadimos el proveedor a cada dispositivo para que el gestor sepa de dónde vienen.
      return devices.map((d) => ({ ...d, provider: 'tuya' }));
    } catch (error) {
      console.error(
        '[TuyaController] Error al obtener los dispositivos:',
        error,
      );
      return [];
    }
  }

  async setState(
    device: any,
    state: { power?: boolean; color?: string },
  ): Promise<boolean> {
    if (!this.isConfigured) return false;

    console.log(
      `[TuyaController] Setting state for device ${device.id} to ${JSON.stringify(state)}`,
    );

    try {
      const deviceInstance = await this.api.getDevice(device.id);
      if (!deviceInstance) {
        console.error(`[TuyaController] Device ${device.id} not found.`);
        return false;
      }

      if (typeof state.power !== 'undefined') {
        await deviceInstance.setPower(state.power);
        console.log(
          `[TuyaController] Set power for ${device.id} to ${state.power}`,
        );
      }

      if (state.color) {
        console.log(
          `[TuyaController] Color change to ${state.color} is not yet implemented.`,
        );
      }

      return true;
    } catch (error) {
      console.error(
        `[TuyaController] Failed to set state for device ${device.id}:`,
        error,
      );
      return false;
    }
  }
}
