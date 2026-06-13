import { ipcMain } from 'electron';
import { IoTManager } from './IoTManager';

// Creamos una única instancia del manager para ser usada por todos los manejadores de este módulo.
const iotManager = new IoTManager();

export function registerIotIpcHandlers() {
  console.log('[IPC-IoT] Registrando manejadores para el módulo de IoT.');

  // Manejador para establecer el estado de un dispositivo
  ipcMain.handle('iot:set-device-state', async (_, { device, state }) => {
    console.log(
      `[IPC-IoT] Received iot:set-device-state for device: ${device.id}`,
    );
    return iotManager.setDeviceState(device, state);
  });

  // Manejador para obtener la lista de todos los dispositivos
  ipcMain.handle('iot:get-devices', async () => {
    console.log('[IPC-IoT] Received iot:get-devices request.');
    const devices = await iotManager.getAllDevices();
    return devices;
  });

  // Aquí se pueden añadir más manejadores relacionados con IoT en el futuro.
}
