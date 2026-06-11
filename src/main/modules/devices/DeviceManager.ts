// src/main/modules/devices/DeviceManager.ts
import { SyncServer } from '../bridge/SyncServer';

class DeviceManager {
  // El operador '!' asegura a TypeScript que nosotros nos encargaremos de la inicialización
  private syncServer!: SyncServer;
  private pollInterval!: NodeJS.Timeout;

  constructor() {}

  public init(syncServer: SyncServer) {
    this.syncServer = syncServer;
    this.startPolling();
  }

  private startPolling() {
    this.pollInterval = setInterval(() => {
      const mockDevices = [
        { id: 'emulator-5554', type: 'VR', model: 'Quest 2', brand: 'Oculus', android: '12', root: false, knox: 'N/A', mdm: 'Unknown', connection: 'WiFi' },
        { id: '192.168.1.10:5555', type: 'Tablet', model: 'Galaxy Tab S8', brand: 'Samsung', android: '13', root: false, knox: 'v3.9', mdm: 'KNOX', connection: 'WiFi' },
        { id: 'R58R30ABCDE', type: 'Smartphone', model: 'S21 Ultra', brand: 'Samsung', android: '14', root: true, knox: 'v3.9', mdm: 'N/A', connection: 'USB' }
      ];

      // El 'as any' bypassa temporalmente el validador estricto de tipos para enviar los datos de prueba
      this.syncServer.broadcastTelemetry(mockDevices as any);
    }, 3000);
  }
}

export const deviceManager = new DeviceManager();