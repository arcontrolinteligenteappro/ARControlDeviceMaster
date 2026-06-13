// src/main/modules/scrcpy/ScrcpyManager.ts
import { spawn, ChildProcess } from 'child_process';
import { BrowserWindow } from 'electron';
import { EventEmitter } from 'events';
import { IpcEvent } from '../../ipc';
import commandExists from 'command-exists';

export interface ScrcpyOptions {
  deviceId: string;
  bitrate?: number;
  maxSize?: number;
  noControl?: boolean;
  windowTitle?: string;
  // Agrega más opciones de scrcpy aquí según sea necesario
}

const DEFAULT_SCRCPY_OPTIONS = {
  noControl: true,
  bitrate: 8000000, // 8 Mbps
  maxSize: 1024, // Limita la resolución
};

class ScrcpyManager extends EventEmitter {
  private sessions: Map<string, ChildProcess> = new Map();
  private mainWindow: BrowserWindow | null = null;
  private isScrcpyAvailable = false;

  constructor() {
    super();
    this.checkScrcpyAvailability();
  }

  private async checkScrcpyAvailability() {
    try {
      await commandExists('scrcpy');
      this.isScrcpyAvailable = true;
      console.log("ScrcpyManager: 'scrcpy' command found in PATH."); // Línea corregida
    } catch (error) {
      this.isScrcpyAvailable = false;
      console.error(
        "ScrcpyManager: 'scrcpy' command not found. Please ensure it's installed and in the system PATH.",
      );
    }
  }

  public setWindow(win: BrowserWindow | null) {
    this.mainWindow = win;
  }

  public start(options: ScrcpyOptions): boolean {
    if (!this.isScrcpyAvailable) {
      console.error(
        "ScrcpyManager: Cannot start session, 'scrcpy' is not available.",
      );
      this.emit(
        'error',
        options.deviceId,
        '"scrcpy" command not found. Make sure it is installed and in your system\'s PATH.',
      );
      return false;
    }

    if (this.sessions.has(options.deviceId)) {
      console.warn(
        `ScrcpyManager: Session for ${options.deviceId} already active.`,
      );
      return false;
    }

    const finalOptions = { ...DEFAULT_SCRCPY_OPTIONS, ...options };

    const args = [
      '--serial',
      finalOptions.deviceId,
      '--window-title',
      finalOptions.windowTitle || `ARCDroid - ${finalOptions.deviceId}`,
      '--max-size',
      `${finalOptions.maxSize}`,
      '--bit-rate',
      `${finalOptions.bitrate}`,
    ];
    if (finalOptions.noControl) {
      args.push('--no-control');
    }

    console.log(
      `ScrcpyManager: Starting session for ${finalOptions.deviceId} with args: ${args.join(' ')}`,
    );

    try {
      const scrcpyProcess = spawn('scrcpy', args, { shell: true });
      this.sessions.set(finalOptions.deviceId, scrcpyProcess);

      scrcpyProcess.stdout.on('data', (data) =>
        this.handleProcessOutput(finalOptions.deviceId, 'stdout', data),
      );
      scrcpyProcess.stderr.on('data', (data) =>
        this.handleProcessOutput(finalOptions.deviceId, 'stderr', data),
      );
      scrcpyProcess.on('close', (code) =>
        this.handleProcessClose(finalOptions.deviceId, code),
      );
      scrcpyProcess.on('error', (err) =>
        this.handleProcessError(finalOptions.deviceId, err),
      );

      this.emit('session-started', finalOptions.deviceId);
      return true;
    } catch (err: any) {
      console.error(
        `ScrcpyManager: Error spawning process for ${finalOptions.deviceId}:`,
        err,
      );
      this.emit(
        'error',
        finalOptions.deviceId,
        `Failed to start Scrcpy process: ${err.message}`,
      );
      return false;
    }
  }

  private handleProcessOutput(
    deviceId: string,
    stream: 'stdout' | 'stderr',
    data: any,
  ) {
    const message = data.toString();
    console.log(`[scrcpy-${deviceId}-${stream}]: ${message.trim()}`);
    // Emitir a la UI para logging/terminal
    this.mainWindow?.webContents.send(
      IpcEvent.TERMINAL_OUTPUT,
      `[scrcpy-${deviceId}] ${message.trim()}`,
    );
  }

  private handleProcessClose(deviceId: string, code: number | null) {
    console.log(
      `ScrcpyManager: Session for ${deviceId} closed with code ${code}.`,
    );
    if (this.sessions.delete(deviceId)) {
      this.emit('session-ended', deviceId);
    }
  }

  private handleProcessError(deviceId: string, err: Error) {
    console.error(`ScrcpyManager: Error in session for ${deviceId}:`, err);
    this.emit('error', deviceId, `Scrcpy process error: ${err.message}`);
    // El evento 'close' se disparará después, así que la limpieza se hará allí
  }

  public stop(deviceId: string): boolean {
    const session = this.sessions.get(deviceId);
    if (session) {
      console.log(`ScrcpyManager: Stopping session for ${deviceId}...`);
      session.kill('SIGTERM'); // Usar SIGTERM para un cierre más limpio
      // La eliminación del mapa se hace en 'handleProcessClose' para evitar condiciones de carrera
      return true;
    }
    console.warn(
      `ScrcpyManager: No active session found for ${deviceId} to stop.`,
    );
    return false;
  }

  public stopAll() {
    if (this.sessions.size === 0) return;
    console.log('ScrcpyManager: Stopping all active sessions...');
    for (const deviceId of this.sessions.keys()) {
      this.stop(deviceId);
    }
  }
}

export const scrcpyManager = new ScrcpyManager();
