// src/main/modules/file/RootExplorer.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class RootExplorer {
    private useSudo: boolean = false;

    constructor(useSudo: boolean = false) {
        this.useSudo = useSudo;
    }

    private getCommand(baseCommand: string): string {
        return this.useSudo ? `su -c "${baseCommand}"` : baseCommand;
    }

    public async listDirectory(deviceSerial: string, path: string): Promise<string> {
        const command = this.getCommand(`ls -la ${path}`);
        const { stdout } = await execAsync(`adb -s ${deviceSerial} shell "${command}"`);
        return stdout;
    }

    public async pushFile(deviceSerial: string, localPath: string, remotePath: string): Promise<string> {
        // For push, we might need to push to a temp location first, then move it with root.
        const tempPath = `/data/local/tmp/sideload_${Date.now()}`;
        await execAsync(`adb -s ${deviceSerial} push ${localPath} ${tempPath}`);
        
        const moveCommand = this.getCommand(`mv ${tempPath} ${remotePath}`);
        const { stdout } = await execAsync(`adb -s ${deviceSerial} shell "${moveCommand}"`);
        return stdout;
    }

    public async pullFile(deviceSerial: string, remotePath: string, localPath: string): Promise<string> {
        const { stdout } = await execAsync(`adb -s ${deviceSerial} pull ${remotePath} ${localPath}`);
        return stdout;
    }

    public async setPermissions(deviceSerial: string, path: string, permissions: string): Promise<string> {
        const command = this.getCommand(`chmod ${permissions} ${path}`);
        const { stdout } = await execAsync(`adb -s ${deviceSerial} shell "${command}"`);
        return stdout;
    }
    
    public async setOwner(deviceSerial: string, path: string, owner: string): Promise<string> {
        const command = this.getCommand(`chown ${owner} ${path}`);
        const { stdout } = await execAsync(`adb -s ${deviceSerial} shell "${command}"`);
        return stdout;
    }
}

export default new RootExplorer();
