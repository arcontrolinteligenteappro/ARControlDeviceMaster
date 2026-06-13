// src/main/core/DeviceManager.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface DeviceSecurityStatus {
  root: boolean;
  knox: string; // e.g., '0x0' for pristine, '0x1' for voided
  mdm: 'Active' | 'Inactive' | 'Unknown';
}

export interface MonitoredDevice {
  id: string;
  transport: 'USB' | 'WiFi';
  model: string;
  product: string;
  device: string;
  security: DeviceSecurityStatus;
}

class DeviceManager {
  constructor() {
    console.log(
      'DeviceManager initialized. Using direct ADB child_process execution.',
    );
  }

  private parseAdbDevicesOutput(output: string): Partial<MonitoredDevice>[] {
    const devices: Partial<MonitoredDevice>[] = [];
    const lines = output.trim().split('\n').slice(1); // Split by newline and remove header

    lines.forEach((line) => {
      if (line.trim() === '' || line.startsWith('*')) return;

      const parts = line.split(/\s+/);
      const id = parts[0];
      const transportId = parts.find((p) => p.startsWith('transport_id:'));

      const model =
        (parts.find((p) => p.startsWith('model:')) || '').split(':')[1] ||
        'Unknown';
      const product =
        (parts.find((p) => p.startsWith('product:')) || '').split(':')[1] ||
        'Unknown';
      const device =
        (parts.find((p) => p.startsWith('device:')) || '').split(':')[1] ||
        'Unknown';

      devices.push({
        id,
        transport: transportId ? 'USB' : 'WiFi', // Heuristic: transport_id is usually for USB
        model,
        product,
        device,
      });
    });

    return devices;
  }

  public async checkSecurityStatus(
    deviceId: string,
  ): Promise<DeviceSecurityStatus> {
    const status: DeviceSecurityStatus = {
      root: false,
      knox: 'Unknown',
      mdm: 'Unknown',
    };

    try {
      // 1. Check for ROOT access
      const { stdout: rootCheck } = await execAsync(
        `adb -s ${deviceId} shell "su -c id"`,
      );
      if (rootCheck.includes('uid=0(root)')) {
        status.root = true;
      }
    } catch (error) {
      status.root = false;
    }

    try {
      // 2. Check Knox Warranty Bit (Samsung specific)
      const { stdout: knoxCheck } = await execAsync(
        `adb -s ${deviceId} shell getprop ro.boot.warranty_bit`,
      );
      if (knoxCheck.trim()) {
        status.knox = knoxCheck.trim();
      }
    } catch (error) {
      // This property may not exist on non-Samsung devices.
    }

    try {
      // 3. Check for active MDM (Device Admin)
      const { stdout: mdmCheck } = await execAsync(
        `adb -s ${deviceId} shell "dumpsys device_policy"`,
      );
      if (mdmCheck.includes('Device Owner:')) {
        status.mdm = 'Active';
      } else {
        status.mdm = 'Inactive';
      }
    } catch (error) {
      // Could fail if command is not available
    }

    return status;
  }

  public async getConnectedDevices(): Promise<MonitoredDevice[]> {
    try {
      const { stdout } = await execAsync('adb devices -l');
      const basicDeviceInfos = this.parseAdbDevicesOutput(stdout);

      const fullDeviceInfos = await Promise.all(
        basicDeviceInfos.map(async (device) => {
          const security = await this.checkSecurityStatus(device.id!);
          return {
            ...device,
            security,
          } as MonitoredDevice;
        }),
      );

      return fullDeviceInfos;
    } catch (error) {
      console.error(
        '[DeviceManager] Failed to execute "adb devices -l":',
        error,
      );
      return [];
    }
  }
}

export const deviceManager = new DeviceManager();
