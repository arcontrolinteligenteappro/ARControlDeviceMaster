// src/main/modules/control/ScrcpyManager.ts
import { spawn, ChildProcess } from 'child_process';
import { getBinPath } from '../../utils/paths';

const scrcpyPath = getBinPath('scrcpy');

export interface ScrcpyConfig {
    deviceSerial: string;
    title?: string;
    bitrate?: string; // e.g., '8M' for 8 Mbps
    maxSize?: number; // e.g., 1024 for a max width/height of 1024
    noControl?: boolean;
    turnScreenOff?: boolean;
    stayAwake?: boolean;
}

class ScrcpyManager {
    private instances: Map<string, ChildProcess> = new Map();

    public start(config: ScrcpyConfig): boolean {
        if (this.instances.has(config.deviceSerial)) {
            console.warn(`Scrcpy instance for device ${config.deviceSerial} is already running.`);
            return false;
        }

        const args = this.buildArgs(config);
        const scrcpyProcess = spawn(scrcpyPath, args);

        this.instances.set(config.deviceSerial, scrcpyProcess);

        scrcpyProcess.on('close', (code) => {
            console.log(`scrcpy for device ${config.deviceSerial} exited with code ${code}`);
            this.instances.delete(config.deviceSerial);
        });

        scrcpyProcess.stderr.on('data', (data) => {
            console.error(`[SCRCPY-ERR-${config.deviceSerial}]: ${data}`);
        });

        return true;
    }

    public stop(deviceSerial: string): void {
        const instance = this.instances.get(deviceSerial);
        if (instance) {
            instance.kill();
            this.instances.delete(deviceSerial);
            console.log(`Stopped scrcpy for device ${deviceSerial}.`);
        }
    }

    private buildArgs(config: ScrcpyConfig): string[] {
        const args = ['-s', config.deviceSerial];

        if (config.title) {
            args.push('--window-title', config.title);
        }
        if (config.bitrate) {
            args.push('-b', config.bitrate);
        }
        if (config.maxSize) {
            args.push('--max-size', String(config.maxSize));
        }
        if (config.noControl) {
            args.push('--no-control');
        }
        if (config.turnScreenOff) {
            args.push('-S');
        }
        if (config.stayAwake) {
            args.push('--stay-awake');
        }

        return args;
    }
}

export default new ScrcpyManager();
