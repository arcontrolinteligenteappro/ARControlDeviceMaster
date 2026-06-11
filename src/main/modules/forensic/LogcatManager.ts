// src/main/modules/forensic/LogcatManager.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { EventEmitter } from 'events';

const LOG_BUFFER_MAX_SIZE = 5000;

export class LogcatManager extends EventEmitter {
    private logcatProcess: ChildProcessWithoutNullStreams | null = null;
    private logBuffer: string[] = [];

    public startStream(deviceId: string) {
        if (this.logcatProcess) {
            console.log(`[LogcatManager] Logcat stream for ${deviceId} is already active.`);
            return;
        }

        this.logcatProcess = spawn('adb', ['-s', deviceId, 'logcat']);
        console.log(`[LogcatManager] Started logcat stream for device: ${deviceId}`);

        this.logcatProcess.stdout.on('data', (data: Buffer) => {
            const lines = data.toString().split('\n').filter(line => line.length > 0);

            lines.forEach(line => {
                // Manage circular buffer
                if (this.logBuffer.length >= LOG_BUFFER_MAX_SIZE) {
                    this.logBuffer.shift();
                }
                this.logBuffer.push(line);

                // Categorize and emit
                const severity = this.getLogSeverity(line);
                this.emit('log', { severity, message: line });
            });
        });

        this.logcatProcess.stderr.on('data', (data: Buffer) => {
            console.error(`[LogcatManager] Error in logcat stream for ${deviceId}: ${data.toString()}`);
        });

        this.logcatProcess.on('close', (code) => {
            console.log(`[LogcatManager] Logcat stream for ${deviceId} closed with code ${code}.`);
            this.logcatProcess = null;
        });

        this.logcatProcess.on('error', (err) => {
            console.error(`[LogcatManager] Failed to start logcat for ${deviceId}.`, err);
            this.logcatProcess = null;
        });
    }

    public stopStream() {
        if (this.logcatProcess) {
            console.log(`[LogcatManager] Stopping logcat stream.`);
            this.logcatProcess.kill();
            this.logcatProcess = null;
        }
    }

    private getLogSeverity(logLine: string): 'Error' | 'Warning' | 'Debug' {
        const firstChar = logLine.trim().charAt(0);
        switch (firstChar) {
            case 'E': return 'Error';
            case 'W': return 'Warning';
            case 'D': return 'Debug';
            default: return 'Debug';
        }
    }
}

export default new LogcatManager();
