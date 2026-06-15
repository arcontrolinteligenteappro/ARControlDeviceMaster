// src/main/services/ScrcpyManager.ts
import { spawn, ChildProcess } from 'child_process';

export class ScrcpyManager {
  private static activeStreams: Map<string, ChildProcess> = new Map();

  static async startStream(deviceId: string): Promise<boolean> {
    if (this.activeStreams.has(deviceId)) {
      console.log(`[Scrcpy] El stream para ${deviceId} ya está activo.`);
      return true;
    }

    try {
      console.log(
        `[Scrcpy] Iniciando puente de video para: ${deviceId} en Modo Producción`,
      );

      // Parámetros tácticos para baja latencia y control absoluto
      const args = [
        '-s',
        deviceId,
        '--bit-rate',
        '8M',
        '--max-fps',
        '60',
        '--window-title',
        `AR Control Master - ${deviceId}`,
        '--stay-awake',
        '--turn-screen-off', // Apaga la pantalla física para ahorrar batería/evitar calentamiento
        '--no-audio', // El audio se enrutará por otro canal si es necesario, priorizamos video
      ];

      const scrcpyProcess = spawn('scrcpy', args);

      scrcpyProcess.stdout.on('data', (data) => {
        // Aquí interceptaremos los buffers en el futuro
        console.log(`[Scrcpy ${deviceId}]: ${data}`);
      });

      scrcpyProcess.stderr.on('data', (data) => {
        console.warn(`[Scrcpy Warn ${deviceId}]: ${data}`);
      });

      scrcpyProcess.on('close', (code) => {
        console.log(
          `[Scrcpy] Stream de ${deviceId} cerrado con código ${code}`,
        );
        this.activeStreams.delete(deviceId);
      });

      this.activeStreams.set(deviceId, scrcpyProcess);
      return true;
    } catch (error) {
      console.error(`[Scrcpy ERROR] Falla al iniciar stream:`, error);
      return false;
    }
  }

  static async stopStream(deviceId: string): Promise<boolean> {
    const stream = this.activeStreams.get(deviceId);
    if (stream) {
      stream.kill();
      this.activeStreams.delete(deviceId);
      console.log(`[Scrcpy] Stream de ${deviceId} aniquilado.`);
      return true;
    }
    return false;
  }
}
