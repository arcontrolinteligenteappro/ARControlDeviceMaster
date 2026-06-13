// src/main/modules/apps/IntentLauncher.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class AdbCommandExecutor {
  public async executeAdbCommand(
    deviceId: string,
    command: string,
  ): Promise<string> {
    try {
      const { stdout } = await execAsync(`adb -s ${deviceId} ${command}`);
      return stdout.trim();
    } catch (error) {
      console.error(
        `Error executing ADB command for ${deviceId}: ${command}`,
        error,
      );
      throw error;
    }
  }
}

export class IntentLauncher extends AdbCommandExecutor {
  public async openDeepLink(deviceId: string, uri: string): Promise<void> {
    console.log(`[IntentLauncher] Abriendo Deep Link: ${uri} en ${deviceId}`);
    try {
      await this.executeAdbCommand(
        deviceId,
        `shell am start -a android.intent.action.VIEW -d "${uri}"`,
      );
      console.log(`[IntentLauncher] Deep Link abierto exitosamente.`);
    } catch (error) {
      console.error(
        `[IntentLauncher] Falló al abrir el Deep Link: ${uri}`,
        error,
      );
      throw error;
    }
  }

  public async openSettings(deviceId: string): Promise<void> {
    console.log(`[IntentLauncher] Abriendo Ajustes en ${deviceId}`);
    try {
      await this.executeAdbCommand(
        deviceId,
        'shell am start -a android.settings.SETTINGS',
      );
      console.log(`[IntentLauncher] Ajustes abiertos exitosamente.`);
    } catch (error) {
      console.error(`[IntentLauncher] Falló al abrir Ajustes.`, error);
      throw error;
    }
  }

  public async openYouTube(deviceId: string): Promise<void> {
    console.log(`[IntentLauncher] Abriendo YouTube en ${deviceId}`);
    await this.openDeepLink(deviceId, 'https://www.youtube.com');
  }

  public async openFileManager(deviceId: string): Promise<void> {
    console.log(`[IntentLauncher] Abriendo Gestor de Archivos en ${deviceId}`);
    try {
      await this.executeAdbCommand(
        deviceId,
        'shell am start -a android.intent.action.GET_CONTENT -t "*/*"',
      );
      console.log(`[IntentLauncher] Gestor de Archivos abierto exitosamente.`);
    } catch (error) {
      console.error(
        `[IntentLauncher] Falló al abrir el Gestor de Archivos.`,
        error,
      );
      throw error;
    }
  }
}

export default new IntentLauncher();
