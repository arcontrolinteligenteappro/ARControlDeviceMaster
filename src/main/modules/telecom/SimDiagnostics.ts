// src/main/modules/telecom/SimDiagnostics.ts
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

export class SimDiagnostics extends AdbCommandExecutor {
  public async releaseNetwork(
    deviceId: string,
    unlockCode: string,
  ): Promise<void> {
    console.log(
      `[NCK SIMULATOR] Iniciando desbloqueo de red para ${deviceId}...`,
    );

    const isUsbDevice = deviceId.indexOf(':') === -1;
    if (!isUsbDevice) {
      throw new Error(
        'La operación de desbloqueo NCK requiere conexión USB directa.',
      );
    }
    console.log(`[NCK SIMULATOR] Verificación de conexión USB superada.`);

    try {
      // 1. Despertar pantalla
      await this.executeAdbCommand(
        deviceId,
        'shell input keyevent KEYCODE_WAKEUP',
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`[NCK SIMULATOR] Pantalla activada.`);

      // 2. Abrir Dialer
      await this.executeAdbCommand(
        deviceId,
        'shell am start -a android.intent.action.DIAL',
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`[NCK SIMULATOR] Dialer abierto.`);

      // 3. Inyectar código de desbloqueo NCK
      const nckSequence = `*#7465625*638*${unlockCode}#`;
      const escapedCode = nckSequence.replace(/'/g, "'\''");
      await this.executeAdbCommand(
        deviceId,
        `shell input text '${escapedCode}'`,
      );
      console.log(`[NCK SIMULATOR] Secuencia de desbloqueo inyectada.`);

      console.log(
        `[NCK SIMULATOR] Proceso de desbloqueo para ${deviceId} finalizado.`,
      );
    } catch (error) {
      console.error(
        `[NCK SIMULATOR] Falló el proceso de liberación para ${deviceId}.`,
        error,
      );
      throw error;
    }
  }
}

export default new SimDiagnostics();
