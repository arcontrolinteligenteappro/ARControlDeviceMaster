import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

const processes: Record<string, ChildProcessWithoutNullStreams> = {};

export function startScrcpy(deviceId: string) {
  if (processes[deviceId]) {
    console.log('SCRCPY ya está corriendo:', deviceId);
    return;
  }

  const scrcpy = spawn('scrcpy', [
    '-s',
    deviceId,
    '--stay-awake',
    '--window-title=' + deviceId,
    '--record=' + `${deviceId}.mp4`,
  ]);

  processes[deviceId] = scrcpy;

  scrcpy.stdout.on('data', (data) => {
    console.log(`[SCRCPY ${deviceId}]`, data.toString());
  });

  scrcpy.stderr.on('data', (data) => {
    console.error(`[SCRCPY ERROR ${deviceId}]`, data.toString());
  });

  scrcpy.on('close', () => {
    console.log('SCRCPY cerrado:', deviceId);
    delete processes[deviceId];
  });

  scrcpy.on('error', (err) => {
    console.error('Error scrcpy:', err);
    delete processes[deviceId];
  });
}
``;
