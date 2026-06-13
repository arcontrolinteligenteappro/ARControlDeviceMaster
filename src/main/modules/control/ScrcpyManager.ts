import { spawn, ChildProcess } from 'child_process';

interface ScrcpyOptions {
  bitRate?: string;
  maxSize?: number;
  maxFps?: number;
  rotation?: number; // 0, 1, 2, 3
  noControl?: boolean;
  turnScreenOff?: boolean;
  stayAwake?: boolean;
  windowTitle?: string;
}

class ScrcpyManager {
  private sessions: Map<string, ChildProcess> = new Map();

  public start(
    deviceId: string,
    options: ScrcpyOptions = {},
    onClose?: () => void,
  ): boolean {
    if (this.sessions.has(deviceId)) {
      console.warn(
        `[ScrcpyManager] Session for ${deviceId} is already running.`,
      );
      return false;
    }

    const scrcpyPath = 'scrcpy';

    const defaultOptions: ScrcpyOptions = {
      bitRate: '8M',
      maxSize: 1080,
      maxFps: 30,
      stayAwake: true,
    };

    const finalOptions = { ...defaultOptions, ...options };

    const args = [
      `-s`,
      deviceId,
      `--bit-rate`,
      finalOptions.bitRate!,
      `--max-size`,
      finalOptions.maxSize!.toString(),
      `--max-fps`,
      finalOptions.maxFps!.toString(),
    ];

    if (finalOptions.stayAwake) args.push('--stay-awake');
    if (finalOptions.turnScreenOff) args.push('--turn-screen-off');
    if (finalOptions.noControl) args.push('--no-control');
    if (finalOptions.rotation !== undefined)
      args.push(`--rotation`, finalOptions.rotation.toString());
    if (finalOptions.windowTitle)
      args.push(`--window-title=${finalOptions.windowTitle}`);

    try {
      const process = spawn(scrcpyPath, args, { stdio: 'pipe' });

      process.stdout?.on('data', (data) =>
        console.log(`[scrcpy-${deviceId}] ${data}`),
      );
      process.stderr?.on('data', (data) =>
        console.error(`[scrcpy-${deviceId}] Error: ${data}`),
      );

      process.on('close', (code) => {
        console.log(
          `[ScrcpyManager] Session for ${deviceId} closed with code ${code}.`,
        );
        this.sessions.delete(deviceId);
        if (onClose) {
          onClose();
        }
      });

      this.sessions.set(deviceId, process);
      console.log(`[ScrcpyManager] Started session for ${deviceId}`);
      return true;
    } catch (error) {
      console.error(
        `[ScrcpyManager] Failed to start scrcpy for ${deviceId}:`,
        error,
      );
      return false;
    }
  }

  public stop(deviceId: string): boolean {
    const process = this.sessions.get(deviceId);
    if (process) {
      console.log(`[ScrcpyManager] Stopping session for ${deviceId}.`);
      process.kill();
      return true;
    }
    return false;
  }
}

export const scrcpyManager = new ScrcpyManager();
