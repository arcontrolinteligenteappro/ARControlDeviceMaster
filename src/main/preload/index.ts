import { contextBridge, ipcRenderer } from 'electron';

export const api = {
  // DOMINIO: CONTROL (Fase 1, 2, 2.5)
  control: {
    getDevices: () => ipcRenderer.invoke('control:getDevices'),
    multiBroadcast: (deviceIds: string[], command: string) =>
      ipcRenderer.invoke('control:multiBroadcast', deviceIds, command),
    multiStream: (deviceIds: string[], inputCmd: string) =>
      ipcRenderer.invoke('control:multiStream', deviceIds, inputCmd),
    multiClose: (deviceIds: string[]) =>
      ipcRenderer.invoke('control:multiClose', deviceIds),
  },

  // DOMINIO: FORENSE (Fase 11) - Preparado para futuras implementaciones
  forensic: {
    extractSQLite: (deviceId: string, target: string) =>
      ipcRenderer.invoke('forensic:extractSQLite', deviceId, target),
    carveData: (dbPath: string) =>
      ipcRenderer.invoke('forensic:carveData', dbPath),
  },

  // DOMINIO: TELECOM (Fase 10)
  telecom: {
    injectApn: (deviceIds: string[], config: any) =>
      ipcRenderer.invoke('telecom:injectApn', deviceIds, config),
  },
};

if (process.contextIsolated) {
  contextBridge.exposeInMainWorld('api', api);
} else {
  // @ts-ignore
  window.api = api;
}
