// src/main/modules/telecom/ApnRawManager.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

interface ApnConfig {
  name: string;
  numeric: string;
  apn: string;
}

class ApnRawManager {
  public static async injectApn(
    deviceIds: string[],
    apnConfig: ApnConfig,
  ): Promise<void> {
    const { name, numeric, apn } = apnConfig;

    for (const deviceId of deviceIds) {
      try {
        const command = `shell content insert --uri content://telephony/carriers --bind name:s:"${name}" --bind numeric:s:"${numeric}" --bind apn:s:"${apn}"`;
        console.log(`Executing on ${deviceId}: adb ${command}`);
        await execPromise(`adb -s ${deviceId} ${command}`);
      } catch (error) {
        console.error(`Failed to inject APN on ${deviceId}:`, error);
      }
    }
  }
}

export default ApnRawManager;
