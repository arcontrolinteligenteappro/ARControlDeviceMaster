// src/main/services/ApkManager.ts
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export class ApkManager {
  static async installApk(
    deviceId: string,
    apkPath: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(
        `[ApkManager] Inyectando binario en ${deviceId} desde ruta: ${apkPath}`,
      );
      // Ejecuta la instalación forzando el downgrade y permitiendo pruebas si es necesario (-r -d -t)
      const { stdout } = await execAsync(
        `adb -s ${deviceId} install -r -d "${apkPath}"`,
      );
      return { success: true, message: stdout.trim() };
    } catch (error: any) {
      console.error(`[ApkManager ERROR]:`, error.message);
      return { success: false, message: error.message };
    }
  }

  static async listPackages(
    deviceId: string,
    filterType: 'all' | 'system' | 'third-party',
  ): Promise<string[]> {
    try {
      let flag = '';
      if (filterType === 'system') flag = '-s';
      if (filterType === 'third-party') flag = '-3';

      const { stdout } = await execAsync(
        `adb -s ${deviceId} shell pm list packages ${flag}`,
      );
      return stdout
        .split('\n')
        .map((line) => line.replace('package:', '').trim())
        .filter((line) => line.length > 0)
        .sort();
    } catch (error) {
      return [];
    }
  }
}
