export enum DeviceState {
  Online = 'device',
  Offline = 'offline',
  // Add other states if known, e.g., 'unauthorized', 'bootloader'
}

export interface Device {
  id: string;
  model: string;
  state: DeviceState;
}