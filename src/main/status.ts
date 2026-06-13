import { exec } from 'child_process';

export function getSystemStatus(): Promise<any> {
  return new Promise((resolve) => {
    exec('adb devices', (err, stdout) => {
      const devices = stdout
        .split('\n')
        .filter((line) => line.includes('device') && !line.includes('List'));

      resolve({
        adb: devices.length > 0,
        devicesCount: devices.length,
        iot: true,
        mqtt: true,
      });
    });
  });
}
