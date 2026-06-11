// src/renderer/src/hooks/useSync.ts
import { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

// Interfaz de Telemetría (debe ser idéntica a la del DeviceManager y SyncServer)
type DeviceType = 'Smartphone' | 'Tablet' | 'Android TV' | 'FireOS' | 'VR' | 'Unknown';
interface MonitoredDevice {
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
 * Hook para la Sinergia Móvil.
 * Detecta si la app corre en una Tablet (navegador) y se conecta al SyncServer
 * para recibir la telemetría de los dispositivos en tiempo real.
 * En modo Electron (PC), este hook permanece inactivo.
 */
export function useSync() {
  const [devices, setDevices] = useState<MonitoredDevice[]>([]);

  useEffect(() => {
    // Activar solo en el contexto de un navegador para la Tablet.
    if (isBrowser) {
      console.log('[useSync] Modo Sinergia Móvil detectado. Conectando al Bridge...');
      
      // La Tablet se conecta al servidor Express/Socket.io que corre en la app de PC.
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

      // Limpiar conexión al desmontar
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  return { 
    devices, 
    isMobile: isBrowser 
  };
}
