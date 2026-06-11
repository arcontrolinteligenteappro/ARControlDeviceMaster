// src/main/modules/apps/ApkManager.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class ApkManager {

    public async install(deviceSerial: string, apkPath: string): Promise<string> {
        const { stdout } = await execAsync(`adb -s ${deviceSerial} install -r ${apkPath}`);
        return stdout;
    }

    public async uninstall(deviceSerial: string, packageName: string): Promise<string> {
        const { stdout } = await execAsync(`adb -s ${deviceSerial} shell pm uninstall -k --user 0 ${packageName}`);
        return stdout;
    }

    public async extract(deviceSerial: string, packageName: string, destinationPath: string): Promise<string> {
        // Get the path of the APK file on the device
        const { stdout: apkPathOutput } = await execAsync(`adb -s ${deviceSerial} shell pm path ${packageName}`);
        const apkPath = apkPathOutput.replace('package:', '').trim();

        if (!apkPath) {
            throw new Error(`Could not find path for package: ${packageName}`);
        }

        // Pull the APK to the specified destination
        const { stdout } = await execAsync(`adb -s ${deviceSerial} pull ${apkPath} ${destinationPath}`);
        return stdout;
    }
}

export default new ApkManager();
