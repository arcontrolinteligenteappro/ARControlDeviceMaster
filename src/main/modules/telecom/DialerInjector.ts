// src/main/modules/telecom/DialerInjector.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

/**
 * Inyecta códigos de marcación (incluyendo USSD) en un dispositivo Android a través de ADB.
 */
class DialerInjector {
  /**
   * Ejecuta un comando ADB en un dispositivo específico.
   * @param deviceId - El ID del dispositivo.
   * @param command - El comando a ejecutar (sin 'adb -s <deviceId>').
   * @returns Una promesa que se resuelve si el comando tiene éxito.
   * @throws Si el comando ADB falla.
   */
  private static async executeAdbCommand(
    deviceId: string,
    command: string,
  ): Promise<string> {
    const fullCommand = `adb -s ${deviceId} ${command}`;
    try {
      const { stdout } = await execPromise(fullCommand);
      return stdout;
    } catch (error) {
      console.error(`Failed to execute: ${fullCommand}`, error);
      // Re-lanzamos el error para que el llamador pueda manejarlo.
      throw error;
    }
  }

  /**
   * Inyecta y ejecuta un código de marcación o USSD en el dispositivo.
   * Este método utiliza un Intent de Android para iniciar la acción de llamada directamente,
   * lo que es más robusto que simular la escritura en el marcador.
   *
   * NOTA: El dispositivo debe estar desbloqueado para que el Intent se ejecute correctamente.
   *
   * @param deviceId - El ID del dispositivo.
   * @param code - El código a inyectar (ej. '*123#').
   * @returns Una promesa que se resuelve con un booleano indicando el éxito.
   */
  public static async injectCode(
    deviceId: string,
    code: string,
  ): Promise<boolean> {
    try {
      // Despertamos la pantalla por si estuviera apagada.
      // Esto no desbloquea el dispositivo, solo enciende la pantalla.
      await this.executeAdbCommand(
        deviceId,
        'shell input keyevent KEYCODE_WAKEUP',
      );

      // Pausa breve para asegurar que el comando anterior se complete.
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Codificamos el código para que sea seguro en una URI.
      // Principalmente, el carácter '#' debe ser codificado como '%23'.
      const encodedCode = encodeURIComponent(code);

      // Usamos el Intent 'ACTION_CALL' con el esquema 'tel:'.
      // Esto inicia directamente la llamada o el código USSD.
      await this.executeAdbCommand(
        deviceId,
        `shell am start -a android.intent.action.CALL -d tel:${encodedCode}`,
      );

      console.log(
        `Código '${code}' ejecutado exitosamente en el dispositivo ${deviceId}`,
      );
      return true;
    } catch (error) {
      console.error(`Fallo al ejecutar el código en ${deviceId}.`, error);
      // Devolvemos 'false' para indicar el fallo.
      return false;
    }
  }
}

export default DialerInjector;
