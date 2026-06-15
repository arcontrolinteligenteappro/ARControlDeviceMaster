// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';
import { IpcChannels, DeviceTelemetry, IpcResponse } from '../shared/ipc-types';

export const api = {
  // --- MÓDULO ADB ---
  getDevices: (): Promise<IpcResponse<DeviceTelemetry[]>> =>
    ipcRenderer.invoke(IpcChannels.ADB_GET_DEVICES),

  connectManual: (ip: string, port: string): Promise<IpcResponse> =>
    ipcRenderer.invoke(IpcChannels.ADB_CONNECT_MANUAL, { ip, port }),

  // --- MÓDULO SCRCPY ---
  startScrcpy: (deviceId: string): Promise<IpcResponse> =>
    ipcRenderer.invoke(IpcChannels.SCRCPY_START, deviceId),

  stopScrcpy: (deviceId: string): Promise<IpcResponse> =>
    ipcRenderer.invoke(IpcChannels.SCRCPY_STOP, deviceId),

  // --- MÓDULO GESTIÓN DE APLICACIONES (APK / DEBLOAT) ---
  installApk: (deviceId: string, apkPath: string): Promise<IpcResponse> =>
    ipcRenderer.invoke(IpcChannels.APK_INSTALL, { deviceId, apkPath }),

  listPackages: (
    deviceId: string,
    type: 'all' | 'system' | 'third-party',
  ): Promise<IpcResponse<string[]>> =>
    ipcRenderer.invoke(IpcChannels.APK_LIST_PACKAGES, { deviceId, type }),

  uninstallSystemApp: (
    deviceId: string,
    packageName: string,
  ): Promise<IpcResponse> =>
    ipcRenderer.invoke(IpcChannels.APK_UNINSTALL_SYSTEM, {
      deviceId,
      packageName,
    }),

  // --- DIÁLOGO DE ARCHIVOS (De su versión anterior, conservado de forma segura) ---
  invokeFileDialog: () => ipcRenderer.invoke('open-file-dialog-for-apk'),

  // --- LISTENERS EN TIEMPO REAL ---
  onTelemetryUpdate: (callback: (data: DeviceTelemetry[]) => void) => {
    ipcRenderer.on(IpcChannels.TELEMETRY_STREAM, (_event, data) =>
      callback(data),
    );
  },

  removeTelemetryListeners: () => {
    ipcRenderer.removeAllListeners(IpcChannels.TELEMETRY_STREAM);
  },
};

// Exponer la API al proceso visual (React) con el nombre exacto que usamos
contextBridge.exposeInMainWorld('electronAPI', api);

// Tipado estricto para que TypeScript no marque errores en React
declare global {
  interface Window {
    electronAPI: typeof api;
  }
}
