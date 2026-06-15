import { spawn } from 'child_process';
import { getBinPath } from './utils/paths';

const streams: any = {};

export function startH264Stream(deviceId: string, win: any) {
  if (streams[deviceId]) return;

  const scrcpy = getBinPath('scrcpy.exe');
  const server = getBinPath('scrcpy-server');

  const proc = spawn(scrcpy, [
    '-s',
    deviceId,
    `--server=${server}`,
    '--video-codec=h264',
    '--video-bit-rate=8M',
    '--max-fps=60',
    '--no-window',
    '--no-control',
    '--record=-',
  ]);

  streams[deviceId] = proc;

  proc.stdout.on('data', (chunk) => {
    win.send('scrcpy:h264', {
      id: deviceId,
      data: chunk.toString('base64'),
    });
  });

  proc.stderr.on('data', (err) => {
    console.log('SCRCPY:', err.toString());
  });

  proc.on('close', () => {
    delete streams[deviceId];
  });
}
