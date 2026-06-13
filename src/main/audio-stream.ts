import { spawn } from 'child_process';

export function startAudio(id: string, win: any) {
  const proc = spawn('scrcpy', ['-s', id, '--no-video', '--audio']);

  proc.stdout.on('data', (chunk) => {
    win.send('scrcpy:audio', chunk.toString('base64'));
  });
}
``;
