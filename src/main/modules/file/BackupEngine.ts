// src/main/modules/file/BackupEngine.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class BackupEngine {
  public async createFullBackup(
    deviceId: string,
    backupPath: string,
  ): Promise<string> {
    try {
      const command = `adb -s ${deviceId} backup -apk -shared -all -f ${backupPath}`;
      const { stdout, stderr } = await execAsync(command);
      if (stderr) {
        // ADB backup command often writes progress to stderr, so we check for actual errors.
        if (stderr.toLowerCase().includes('error')) {
          throw new Error(`Backup failed: ${stderr}`);
        }
      }
      return `Backup for device ${deviceId} created at ${backupPath}
${stdout || stderr}`;
    } catch (error) {
      console.error(`Error creating backup for device ${deviceId}:`, error);
      throw error;
    }
  }

  public async restoreBackup(
    deviceId: string,
    backupPath: string,
  ): Promise<string> {
    try {
      const command = `adb -s ${deviceId} restore ${backupPath}`;
      const { stdout, stderr } = await execAsync(command);
      if (stderr) {
        if (stderr.toLowerCase().includes('error')) {
          throw new Error(`Restore failed: ${stderr}`);
        }
      }
      return `Restore for device ${deviceId} from ${backupPath} finished.
${stdout || stderr}`;
    } catch (error) {
      console.error(`Error restoring backup to device ${deviceId}:`, error);
      throw error;
    }
  }
}
