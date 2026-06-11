// src/main/modules/apps/DebloatEngine.ts
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

type DebloatProfile = 'google' | 'samsung' | 'carrier' | 'oem';

class DebloatEngine {
    private static profiles: Record<DebloatProfile, string[]> = {
        google: [
            'com.google.android.apps.maps',
            'com.google.android.music',
            'com.google.android.videos',
            'com.google.android.youtube',
            'com.google.android.gm',
            'com.google.android.apps.docs',
            'com.google.android.apps.photos',
            'com.google.android.apps.tachyon', // Duo
        ],
        samsung: [
            'com.samsung.android.app.sbrowser',
            'com.samsung.android.email.provider',
            'com.samsung.android.bixby.agent',
            'com.samsung.android.app.spage', // Bixby Home
            'com.samsung.android.svoice.sync',
            'com.samsung.android.app.samsungpass',
            'com.samsung.android.scloud',
        ],
        carrier: [
            'com.tmobile.pr.mytmobile',
            'com.verizon.messaging.vzmsgs',
            'com.att.android.attsmartwifi',
        ],
        oem: [
            'com.facebook.katana',
            'com.facebook.system',
            'com.facebook.appmanager',
        ],
    };

    private static async executeCommand(deviceId: string, command: string): Promise<{ stdout: string; stderr: string }> {
        return execPromise(`adb -s ${deviceId} shell "${command}"`);
    }

    public static async executeProfile(deviceId: string, profileName: DebloatProfile, method: 'uninstall' | 'disable' = 'disable'): Promise<void> {
        const packages = this.profiles[profileName];
        if (!packages) {
            console.error(`Debloat profile "${profileName}" not found.`);
            return;
        }

        for (const pkg of packages) {
            try {
                let command;
                if (method === 'uninstall') {
                    command = `pm uninstall -k --user 0 ${pkg}`;
                } else {
                    command = `pm disable-user --user 0 ${pkg}`;
                }
                console.log(`Executing on ${deviceId}: ${command}`);
                const { stderr } = await this.executeCommand(deviceId, command);
                if (stderr && !stderr.includes('not installed for user')) {
                   console.error(`Error debloating ${pkg} on ${deviceId}: ${stderr}`);
                }
            } catch (error) {
                console.error(`Failed to execute debloat for ${pkg} on ${deviceId}:`, error);
            }
        }
    }
}

export default DebloatEngine;
