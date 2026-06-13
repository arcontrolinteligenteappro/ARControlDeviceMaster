// src/main/modules/devices/Device.ts

export type DeviceState = 'device' | 'authorizing' | 'offline' | 'unauthorized';

export interface Device {
  id: string;
  state: DeviceState;
  model?: string; // Se obtendrá con 'adb shell getprop ro.product.model'
  isRooted?: boolean; // Se verificará con 'adb shell su -c whoami'
  knoxDetected?: boolean; // Verificación específica de Samsung
  mdmActive?: boolean; // Verificación de Mobile Device Management
}
