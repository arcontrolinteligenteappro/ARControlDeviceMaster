// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  captureScreen: (id: string) => ipcRenderer.invoke('capture-screenshot', id),
  openShell: (id: string) => ipcRenderer.invoke('open-shell', id),
  startForensic: (id: string) => ipcRenderer.invoke('forensic-start', id),
  startScrcpy: (id: string) => ipcRenderer.invoke('scrcpy-start', id),
  stopScrcpy: (id: string) => ipcRenderer.invoke('scrcpy-stop', id),
  // Comando añadido para la funcionalidad de reinicio remoto
  rebootDevice: (id: string) => ipcRenderer.invoke('reboot-device', id),
});
