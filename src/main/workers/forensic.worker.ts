// src/main/workers/forensic.worker.ts
import { parentPort } from 'worker_threads';
import Adb from '@devicefarmer/adbkit';
import { promises as fs } from 'fs';
import path from 'path';

const client = Adb.createClient();

interface ForensicOptions {
  deviceId: string;
  dumpType: 'full' | 'quick'; // Por ahora, solo como ejemplo
}

async function performForensicDump(options: ForensicOptions) {
  const { deviceId } = options;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dumpDir = path.join(
    process.cwd(),
    `forensic_dump_${deviceId}_${timestamp}`,
  );

  try {
    postProgress('info', `Creating dump directory: ${dumpDir}`);
    await fs.mkdir(dumpDir, { recursive: true });

    // 1. Get package list
    postProgress('info', 'Extracting package list...');
    const packages = await client
      .shell(deviceId, 'pm list packages')
      .then(Adb.util.readAll);
    await fs.writeFile(path.join(dumpDir, 'packages.txt'), packages);
    postProgress('success', 'Package list extracted.');

    // 2. Get system properties
    postProgress('info', 'Extracting system properties...');
    const properties = await client
      .shell(deviceId, 'getprop')
      .then(Adb.util.readAll);
    await fs.writeFile(path.join(dumpDir, 'properties.txt'), properties);
    postProgress('success', 'System properties extracted.');

    // 3. Attempt to pull contacts database
    const contactsDbPath =
      '/data/data/com.android.providers.contacts/databases/contacts2.db';
    postProgress('info', `Attempting to pull ${contactsDbPath}...`);
    try {
      const transfer = await client.pull(deviceId, contactsDbPath);
      await new Promise((resolve, reject) => {
        transfer.on('end', resolve);
        transfer.on('error', reject);
        transfer.pipe(fs.createWriteStream(path.join(dumpDir, 'contacts2.db')));
      });
      postProgress(
        'success',
        'Contacts database pulled successfully (device might be rooted).',
      );
    } catch (err: any) {
      postProgress(
        'warn',
        `Failed to pull contacts database: ${err.message}. This is expected on non-rooted devices.`,
      );
    }

    // 4. Finalizing
    postProgress('info', 'Forensic dump process finished.');
    postProgress('final', `SUCCESS: Dump saved to ${dumpDir}`);
  } catch (err: any) {
    console.error('Forensic worker error:', err);
    postProgress('error', `A critical error occurred: ${err.message}`);
    postProgress('final', `FAILED: The process was aborted due to an error.`);
  }
}

function postProgress(
  type: 'info' | 'success' | 'warn' | 'error' | 'final',
  message: string,
) {
  parentPort?.postMessage({ type, message });
}

parentPort?.on('message', (options: ForensicOptions) => {
  console.log('Forensic worker received job:', options);
  postProgress(
    'info',
    `Starting forensic dump for device ${options.deviceId}...`,
  );
  performForensicDump(options).catch((err) => {
    // This catch is a fallback
    console.error('Unhandled exception in performForensicDump', err);
    postProgress('error', 'An unhandled exception occurred.');
  });
});
