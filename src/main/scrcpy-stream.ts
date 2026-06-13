import { spawn } from 'child_process';

const streams: Record<string, any> = {};

export function startStream(deviceId: string, win: any) {
  if (streams[deviceId]) return;

  const proc = spawn('scrcpy', [
    '-s',
    deviceId,
    '--no-control',
    '--no-audio',
    '--max-size=800',
    '--bit-rate=2M',
    '--output=-',
  ]);

  streams[deviceId] = proc;

  proc.stdout.on('data', (chunk) => {
    win.send('scrcpy:frame', {
      id: deviceId,
      frame: chunk.toString('base64'),
    });
  });

  proc.on('close', () => {
    delete streams[deviceId];
  });
}
``;
