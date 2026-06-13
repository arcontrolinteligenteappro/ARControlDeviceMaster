// src/main/modules/control/RebootManager.ts
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export class RebootManager {
  private async executeCommand(
    command: string,
  ): Promise<{ stdout: string; stderr: string }> {
    try {
      const { stdout, stderr } = await execPromise(command);
      return { stdout, stderr };
    } catch (error) {
      console.error(`Error executing command "${command}":`, error);
      throw error;
    }
  }

  public reboot(deviceId: string): Promise<{ stdout: string; stderr: string }> {
    return this.executeCommand(`adb -s ${deviceId} reboot`);
  }

  public rebootToRecovery(
    deviceId: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return this.executeCommand(`adb -s ${deviceId} reboot recovery`);
  }

  public rebootToBootloader(
    deviceId: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return this.executeCommand(`adb -s ${deviceId} reboot bootloader`);
  }

  public rebootToDownload(
    deviceId: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return this.executeCommand(`adb -s ${deviceId} reboot download`);
  }

  public rebootToEdl(
    deviceId: string,
  ): Promise<{ stdout: string; stderr: string }> {
    return this.executeCommand(`adb -s ${deviceId} reboot edl`);
  }
}
