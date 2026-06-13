import { Adb, Device, DeviceClient } from '@devicefarmer/adbkit';
import { BrowserWindow } from 'electron';

// --- TIPOS ---
type DeviceType =
  | 'Smartphone'
  | 'Tablet'
  | 'Android TV'
  | 'FireOS'
  | 'VR'
  | 'Unknown';

export interface MonitoredDevice {
  id: string;
  type: DeviceType;
  model: string;
  brand: string;
  android: string;
  root: boolean;
  knox: string;
  mdm: string;
  connection: 'USB' | 'WiFi';
  // ... más propiedades de telemetría ...
}

// --- GESTOR DE DISPOSITIVOS ---

class DeviceManager {
  private client = Adb.createClient();
  private devices: Map<string, MonitoredDevice> = new Map();
  private window: BrowserWindow | null = null;

  constructor() {
    this.setupDeviceTracking();
  }

  public setWindow(win: BrowserWindow) {
    this.window = win;
    // Enviar la lista de dispositivos inicial al conectar la ventana
    this.sendDeviceList();
  }

  private async setupDeviceTracking() {
    try {
      const tracker = await this.client.trackDevices();
      tracker.on('add', async (device) => {
        console.log(`[DeviceManager] Dispositivo conectado: ${device.id}`);
        await this.addDevice(device);
      });
      tracker.on('remove', (device) => {
        console.log(`[DeviceManager] Dispositivo desconectado: ${device.id}`);
        this.removeDevice(device.id);
      });
      tracker.on('end', () => {
        console.log(
          '[DeviceManager] El seguimiento de dispositivos ha finalizado.',
        );
      });
    } catch (err) {
      console.error(
        '[DeviceManager] Error al iniciar el seguimiento de dispositivos:',
        err,
      );
    }
  }

  private async addDevice(device: Device) {
    try {
      const client = this.client.getDevice(device.id);
      const properties = await client.getProperties();

      const monitoredDevice: MonitoredDevice = {
        id: device.id,
        type: this.getDeviceType(properties),
        model: properties['ro.product.model'] || 'N/A',
        brand: properties['ro.product.brand'] || 'N/A',
        android: properties['ro.build.version.release'] || 'N/A',
        root: await this.isRooted(client),
        knox: properties['ro.knox.version'] || 'N/A',
        mdm: 'None', // Placeholder, la detección de MDM es compleja
        connection: device.type === 'device' ? 'USB' : 'WiFi',
      };

      this.devices.set(device.id, monitoredDevice);
      this.sendDeviceList();
    } catch (err) {
      console.error(
        `[DeviceManager] Error al añadir el dispositivo ${device.id}:`,
        err,
      );
    }
  }

  private removeDevice(id: string) {
    if (this.devices.has(id)) {
      this.devices.delete(id);
      this.sendDeviceList();
    }
  }

  private getDeviceType(properties: { [key: string]: string }): DeviceType {
    if (properties['ro.product.model'].toLowerCase().includes('quest'))
      return 'VR';
    if (properties['ro.amazon.device']) return 'FireOS';
    if (properties['ro.build.characteristics'] === 'tv') return 'Android TV';
    if (properties['ro.build.characteristics'] === 'tablet') return 'Tablet';
    return 'Smartphone';
  }

  private async isRooted(client: DeviceClient): Promise<boolean> {
    try {
      const stream = await client.shell('su -c whoami');
      const output = await Adb.util.readAll(stream);
      return output.toString().trim() === 'root';
    } catch (err) {
      return false;
    }
  }

  private sendDeviceList() {
    if (this.window) {
      this.window.webContents.send(
        'devices-updated',
        Array.from(this.devices.values()),
      );
    }
  }

  public getDevices(): MonitoredDevice[] {
    return Array.from(this.devices.values());
  }
}

export const deviceManager = new DeviceManager();
