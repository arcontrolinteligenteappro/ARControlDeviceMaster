import { parentPort, workerData } from 'worker_threads';
import { AdbService } from '../adb/AdbService'; // Suponiendo una clase AdbService exportada

const { deviceId } = workerData;
const adbService = new AdbService();

if (!parentPort) {
  throw new Error('This script must be run as a worker thread.');
}

let keyMappings: { [key: string]: { x: number; y: number } } = {};

parentPort.on('message', async (message) => {
  if (message.type === 'UPDATE_MAPPINGS') {
    console.log(`[Keymapper Worker ${deviceId}] Updating mappings.`);
    keyMappings = message.mappings.reduce((acc: any, map: any) => {
      acc[map.key] = { x: map.x, y: map.y };
      return acc;
    }, {});
  } else if (message.type === 'KEY_DOWN') {
    const mapping = keyMappings[message.key];
    if (mapping) {
      const command = `input tap ${mapping.x} ${mapping.y}`;
      try {
        // No esperar la promesa para no bloquear el worker
        adbService.shell(deviceId, command);
      } catch (e) {
        console.error(
          `[Keymapper Worker ${deviceId}] Failed to execute tap:`,
          e,
        );
      }
    }
  }
});

parentPort.postMessage('ready');
