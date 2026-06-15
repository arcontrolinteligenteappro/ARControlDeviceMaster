// src/main/services/DebloatEngine.ts
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

export class DebloatEngine {
  // Desinstalación profunda a nivel de usuario root virtual sin alterar la partición de solo lectura
  static async uninstallSystemApp(
    deviceId: string,
    packageName: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(
        `[Debloat] Purgando paquete del sistema: ${packageName} en el dispositivo ${deviceId}`,
      );
      const { stdout } = await execAsync(
        `adb -s ${deviceId} shell pm uninstall -k --user 0 ${packageName}`,
      );
      return { success: true, message: stdout.trim() };
    } catch (error: any) {
      console.error(`[Debloat ERROR]:`, error.message);
      return { success: false, message: error.message };
    }
  }
}
