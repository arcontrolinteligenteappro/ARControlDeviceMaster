// src/preload/index.ts
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IpcChannel, IpcEvent } from '../main/ipc';

const api = {
  // Función para invocar canales y recibir una promesa (para comunicación de dos vías)
  invoke: (channel: IpcChannel, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args);
  },

  // Función para enviar a canales (para comunicación de una vía)
  send: (channel: IpcEvent, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },

  // Función para suscribirse a eventos desde el proceso principal
  on: (
    channel: IpcEvent,
    listener: (event: IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.on(channel, listener);

    // Devolvemos una función para poder desuscribirse
    return () => {
      ipcRenderer.removeListener(channel, listener);
    };
  },

  // Exponemos de forma segura el manejador de diálogo de archivos que hemos creado
  invokeFileDialog: () => ipcRenderer.invoke('open-file-dialog-for-apk'),
};

// Exponer el API al mundo del renderer de forma segura
contextBridge.exposeInMainWorld('api', api);

// Exponer los nombres de los canales para evitar errores de tipeo
contextBridge.exposeInMainWorld('IpcChannel', IpcChannel);
contextBridge.exposeInMainWorld('IpcEvent', IpcEvent);

// TypeScript anota la existencia de `window.api`
declare global {
  interface Window {
    api: typeof api;
    IpcChannel: typeof IpcChannel;
    IpcEvent: typeof IpcEvent;
  }
}
