import { TuyaController } from './providers/TuyaController';
import { SmartThingsController } from './providers/SmartThingsController';
import { YeelightController } from './providers/YeelightController';

export class IoTManager {
  private controllers: {
    tuya: TuyaController;
    smartthings: SmartThingsController;
    yeelight: YeelightController;
  };

  constructor() {
    this.controllers = {
      tuya: new TuyaController(),
      smartthings: new SmartThingsController(),
      yeelight: new YeelightController(),
    };
    console.log(
      '[IoTManager] Gestor de IoT inicializado con todos los controladores.',
    );
  }

  async getAllDevices(): Promise<any[]> {
    console.log(
      '[IoTManager] Obteniendo dispositivos de todos los proveedores...',
    );

    const devicePromises = Object.values(this.controllers).map((controller) =>
      controller.getDevices().catch((err) => {
        // Evitamos que un controlador que falle detenga toda la operación.
        console.error(
          `[IoTManager] Error al obtener dispositivos de un controlador:`,
          err,
        );
        return []; // Devolvemos un array vacío en caso de error.
      }),
    );

    const allDevicesNested = await Promise.all(devicePromises);
    const allDevices = allDevicesNested.flat(); // Aplanamos el array de arrays.

    console.log(
      `[IoTManager] Se encontraron un total de ${allDevices.length} dispositivos.`,
    );
    return allDevices;
  }

  async setDeviceState(device: any, state: any): Promise<boolean> {
    console.log(
      `[IoTManager] Solicitud de cambio de estado para ${device.provider}:${device.id}`,
    );
    const provider = device.provider as keyof typeof this.controllers;

    if (this.controllers[provider]) {
      return this.controllers[provider].setState(device, state);
    }

    console.error(`[IoTManager] Proveedor no reconocido: ${device.provider}`);
    return false;
  }
}
