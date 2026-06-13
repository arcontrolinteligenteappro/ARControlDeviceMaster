// YeelightController.ts - Placeholder

export class YeelightController {
  constructor() {
    console.log(
      '[YeelightController] Controlador de Yeelight inicializado (pero no implementado).',
    );
  }

  async setState(device: any, state: any): Promise<boolean> {
    console.warn(
      `[YeelightController] La función setState para el dispositivo ${device.id} no está implementada.`,
    );
    // Retorna `false` para indicar que la operación no se completó.
    return false;
  }

  async getDevices(): Promise<any[]> {
    console.warn(
      '[YeelightController] La función getDevices no está implementada.',
    );
    return [];
  }
}
