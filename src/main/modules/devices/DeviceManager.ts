// src/main/modules/devices/DeviceManager.ts
import { BrowserWindow } from 'electron';
import Adb from '@devicefarmer/adbkit';
import { EventEmitter } from 'events';
import { Device, DeviceState } from './Device';
import { IpcEvent } from '../../ipc';

// Constantes para los comandos y propiedades de ADB
const ADB_PROPERTIES = {
  MODEL: 'ro.product.model',
};

const ADB_COMMANDS = {
  WHOAMI_ROOT: 'su -c whoami',
};

// Interfaz para un dispositivo ADB puro de adbkit
interface AdbKitDevice {
  id: string;
  type: DeviceState;
}

class DeviceManager extends EventEmitter {
  private client = Adb.createClient();
  private devices: Map<string, Device> = new Map();
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    super();
  }

  public setWindow(win: BrowserWindow | null) {
    this.mainWindow = win;
  }

  public start() {
    console.log('DeviceManager: Starting ADB tracker...');
    this.client
      .trackDevices()
      .then((tracker) => {
        tracker.on('add', (device: AdbKitDevice) =>
          this.handleDeviceAdded(device),
        );
        tracker.on('remove', (device: AdbKitDevice) =>
          this.handleDeviceRemoved(device),
        );
        tracker.on('change', (device: AdbKitDevice) =>
          this.handleDeviceChanged(device),
        );
        tracker.on('end', () =>
          console.log('DeviceManager: Tracking stopped.'),
        );
        tracker.on('error', (err: Error) =>
          console.error('DeviceManager: Tracking error:', err),
        );
      })
      .catch((err: Error) => {
        console.error('DeviceManager: Failed to start ADB tracker:', err.stack);
        this.emit('error', 'Failed to start ADB daemon.');
      });
  }

  private async handleDeviceAdded(adbDevice: AdbKitDevice) {
    console.log(
      `DeviceManager: Device added: ${adbDevice.id} (${adbDevice.type})`,
    );
    if (this.devices.has(adbDevice.id)) {
      return this.handleDeviceChanged(adbDevice);
    }

    const newDevice: Device = { id: adbDevice.id, state: adbDevice.type };
    this.devices.set(adbDevice.id, newDevice);

    if (newDevice.state === 'device') {
      await this.enrichDeviceDetails(newDevice);
    }

    this.notifyUpdates();
  }

  private handleDeviceRemoved(adbDevice: AdbKitDevice) {
    console.log(`DeviceManager: Device removed: ${adbDevice.id}`);
    if (this.devices.delete(adbDevice.id)) {
      this.notifyUpdates();
    }
  }

  private async handleDeviceChanged(adbDevice: AdbKitDevice) {
    console.log(
      `DeviceManager: Device changed: ${adbDevice.id} -> ${adbDevice.type}`,
    );
    const existingDevice = this.devices.get(adbDevice.id);

    if (!existingDevice) {
      return this.handleDeviceAdded(adbDevice);
    }

    if (existingDevice.state !== adbDevice.type) {
      existingDevice.state = adbDevice.type;
      if (existingDevice.state === 'device' && !existingDevice.model) {
        await this.enrichDeviceDetails(existingDevice);
      }
    }

    this.notifyUpdates();
  }

  private async enrichDeviceDetails(device: Device) {
    try {
      device.model = await this.getDeviceModel(device.id);
      device.isRooted = await this.checkRootStatus(device.id);

      // Placeholder for future enrichment
      // device.knoxVersion = await this.getKnoxVersion(device.id);

      console.log('DeviceManager: Enriched device details:', device);
    } catch (err) {
      console.error(
        `DeviceManager: Failed to enrich details for ${device.id}:`,
        err,
      );
      // Podríamos querer establecer un estado de error en el dispositivo aquí
    }
  }

  private async getDeviceModel(deviceId: string): Promise<string> {
    try {
      const properties = await this.client.getProperties(deviceId);
      return properties[ADB_PROPERTIES.MODEL] || 'Unknown';
    } catch (err) {
      console.error(`DeviceManager: Failed to get model for ${deviceId}`, err);
      return 'Unknown';
    }
  }

  private async checkRootStatus(deviceId: string): Promise<boolean> {
    try {
      const output = await this.client
        .shell(deviceId, ADB_COMMANDS.WHOAMI_ROOT)
        .then(Adb.util.readAll);
      return output.toString().trim() === 'root';
    } catch (err) {
      // Si el comando falla, es seguro asumir que no es root.
      return false;
    }
  }

  private notifyUpdates() {
    const deviceList = this.getDevices();
    // Notificar a la ventana principal (Renderer process)
    this.mainWindow?.webContents.send(
      IpcEvent.DEVICES_LIST_UPDATED,
      deviceList,
    );

    // Emitir evento para el proceso principal (Main process)
    this.emit('devices-updated', deviceList);

    // Determinar y emitir el estado de conexión global
    const hasConnectedDevice = deviceList.some((d) => d.state === 'device');
    this.emit(
      'connection-state-changed',
      hasConnectedDevice ? 'Connected' : 'Disconnected',
    );
  }

  public getDevices(): Device[] {
    return Array.from(this.devices.values());
  }
}

export const deviceManager = new DeviceManager();
