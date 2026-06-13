// src/renderer/src/hooks/useSync.ts
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

// Interfaz de Telemetría (debe ser idéntica a la del DeviceManager y SyncServer)
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
}

const isBrowser = !/electron/i.test(navigator.userAgent);

/**
 * Hook para la Sinergia Móvil y la app de escritorio.
 * - En modo Tablet (navegador), se conecta al SyncServer vía Socket.io.
 * - En modo PC (Electron), escucha los eventos del proceso principal vía IPC.
 */
export function useSync() {
  const [devices, setDevices] = useState<MonitoredDevice[]>([]);

  useEffect(() => {
    if (isBrowser) {
      // MODO TABLET (NAVEGADOR)
      console.log(
        '[useSync] Modo Sinergia Móvil detectado. Conectando al Bridge...',
      );
      const socket: Socket = io(`http://${window.location.hostname}:3000`);

      socket.on('connect', () => {
        console.log('[useSync] Conexión con Bridge establecida.');
      });

      socket.on('telemetry-update', (data: MonitoredDevice[]) => {
        setDevices(data);
      });

      socket.on('disconnect', () => {
        console.log('[useSync] Conexión con Bridge perdida.');
      });

      return () => {
        socket.disconnect();
      };
    } else {
      // MODO PC (ELECTRON)
      console.log(
        '[useSync] Modo Escritorio detectado. Escuchando telemetría local...',
      );

      // El proceso principal envía los datos a través del preload script
      const handleTelemetryUpdate = (_event: any, data: MonitoredDevice[]) => {
        setDevices(data);
      };

      window.electron.ipcRenderer.on('telemetry-update', handleTelemetryUpdate);

      // Limpiar el listener al desmontar
      return () => {
        window.electron.ipcRenderer.removeListener(
          'telemetry-update',
          handleTelemetryUpdate,
        );
      };
    }
  }, []);

  const manualConnect = (ip: string, port: string) => {
    if (!isBrowser) {
      console.log(
        `[useSync] Enviando solicitud de conexión manual para ${ip}:${port}`,
      );
      window.electron.ipcRenderer.send('manual-connect', { ip, port });
    }
  };

  return {
    devices,
    isMobile: isBrowser,
    manualConnect,
  };
}
