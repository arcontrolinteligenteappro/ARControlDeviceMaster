// src/shared/ipc-types.ts

export interface DeviceTelemetry {
  id: string;
  model: string;
  connection: 'USB' | 'WiFi' | 'Offline';
  state: string;
  cpuUsage?: number;
  ramUsage?: string;
  rootStatus?: boolean;
  knoxGuard?: string;
}

export interface IpcResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export enum IpcChannels {
  ADB_SCAN = 'adb:scan',
  ADB_GET_DEVICES = 'adb:get-devices',
  ADB_CONNECT_MANUAL = 'adb:connect-manual',
  TELEMETRY_STREAM = 'telemetry:stream',
  SCRCPY_START = 'scrcpy:start',
  SCRCPY_STOP = 'scrcpy:stop',
  FORENSIC_START_LOGS = 'forensic:start-logs',
  FORENSIC_STOP_LOGS = 'forensic:stop-logs',
  APK_INSTALL = 'apk:install',
  APK_LIST_PACKAGES = 'apk:list-packages',
  APK_UNINSTALL_SYSTEM = 'apk:uninstall-system',
}
