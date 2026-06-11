// src/main/modules/telecom/DialerInjector.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

class DialerInjector {

    private static async executeAdbCommand(deviceId: string, command: string): Promise<void> {
        const fullCommand = `adb -s ${deviceId} ${command}`;
        try {
            await execPromise(fullCommand);
        } catch (error) {
            console.error(`Failed to execute: ${fullCommand}`, error);
            throw error;
        }
    }

    public static async injectCode(deviceId: string, code: string): Promise<void> {
        try {
            // 1. Despertar pantalla (KEYCODE_WAKEUP)
            await this.executeAdbCommand(deviceId, 'shell input keyevent 224');

            // 2. Abrir el marcador telefónico
            await this.executeAdbCommand(deviceId, 'shell am start -a android.intent.action.DIAL');

            // Pausa para permitir que el marcador se abra
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 3. Inyectar código vía input text
            const escapedCode = code.replace(/'/g, "'\\''");
            await this.executeAdbCommand(deviceId, `shell input text '${escapedCode}'`);

            console.log(`Código '${code}' inyectado exitosamente en el dispositivo ${deviceId}`);

        } catch (error) {
            console.error(`Fallo al inyectar el código en ${deviceId}.`, error);
        }
    }
}

export default DialerInjector;
