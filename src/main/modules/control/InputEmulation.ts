// src/main/modules/control/InputEmulation.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

class InputEmulation {
    private shells: Map<string, ChildProcessWithoutNullStreams> = new Map();

    public openShell(deviceId: string): void {
        if (this.shells.has(deviceId)) {
            return;
        }

        const shell = spawn('adb', ['-s', deviceId, 'shell']);
        this.shells.set(deviceId, shell);

        shell.on('exit', (code) => {
            console.log(`Shell for ${deviceId} exited with code ${code}`);
            this.shells.delete(deviceId);
        });
        shell.stderr.on('data', (data) => {
            console.error(`[SHELL-ERR-${deviceId}]: ${data}`);
        });
    }

    public closeShell(deviceId: string): void {
        const shell = this.shells.get(deviceId);
        if (shell) {
            shell.kill();
            this.shells.delete(deviceId);
        }
    }

    public tap(deviceId: string, x: number, y: number): void {
        const shell = this.shells.get(deviceId);
        if (shell) {
            shell.stdin.write(`input tap ${x} ${y}\n`);
        } else {
            console.warn(`No active shell for device ${deviceId} to send tap command.`);
            // Fallback to single command if no shell is open
            spawn('adb', ['-s', deviceId, 'shell', 'input', 'tap', String(x), String(y)]);
        }
    }

    public swipe(deviceId: string, x1: number, y1: number, x2: number, y2: number, duration: number): void {
        const shell = this.shells.get(deviceId);
        if (shell) {
            shell.stdin.write(`input swipe ${x1} ${y1} ${x2} ${y2} ${duration}\n`);
        } else {
            console.warn(`No active shell for device ${deviceId} to send swipe command.`);
             // Fallback to single command
             spawn('adb', ['-s', deviceId, 'shell', 'input', 'swipe', String(x1), String(y1), String(x2), String(y2), String(duration)]);
        }
    }

    public sendText(deviceId: string, text: string): void {
        const shell = this.shells.get(deviceId);
        const escapedText = text.replace(/'/g, "'\''");
        if (shell) {
            shell.stdin.write(`input text '${escapedText}'\n`);
        } else {
            console.warn(`No active shell for device ${deviceId} to send text command.`);
            // Fallback to single command
            spawn('adb', ['-s', deviceId, 'shell', 'input', 'text', `'${escapedText}'`]);
        }
    }
}

export default new InputEmulation();
