// src/renderer/src/hooks/useADB.ts
import { useState, useEffect, useCallback } from 'react';
import { DeviceTelemetry, IpcResponse } from '../../../shared/ipc-types';

export const useADB = () => {
  const [devices, setDevices] = useState<DeviceTelemetry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Petición inicial para listar dispositivos
  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: IpcResponse<DeviceTelemetry[]> =
        await window.electronAPI.getDevices();
      if (response.status === 'success' && response.data) {
        setDevices(response.data);
      } else {
        setError(response.message || 'Error desconocido al escanear ADB.');
      }
    } catch (err: any) {
      setError(
        err.message || 'Falla de comunicación con el proceso principal.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 2. Conexión manual por IP y Puerto (Inyección TCP/IP)
  const connectManual = useCallback(
    async (ip: string, port: string): Promise<IpcResponse> => {
      setIsLoading(true);
      try {
        const response = await window.electronAPI.connectManual(ip, port);
        if (response.status === 'success') {
          await fetchDevices(); // Refrescar inmediatamente tras conectar
        }
        return response;
      } catch (err: any) {
        return { status: 'error', message: err.message };
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDevices],
  );

  // 3. Efecto de escucha para la telemetría en tiempo real (Stream continuo)
  useEffect(() => {
    // Carga inicial
    fetchDevices();

    // Activar el listener del puente IPC
    window.electronAPI.onTelemetryUpdate(
      (updatedDevices: DeviceTelemetry[]) => {
        setDevices(updatedDevices);
      },
    );

    // Limpieza al desmontar el componente para evitar fugas de memoria
    return () => {
      window.electronAPI.removeTelemetryListeners();
    };
  }, [fetchDevices]);

  return {
    devices,
    isLoading,
    error,
    scanDevices: fetchDevices,
    connectManual,
  };
};
