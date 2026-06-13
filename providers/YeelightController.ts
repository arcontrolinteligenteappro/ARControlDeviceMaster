import net from 'net';

export class YeelightController {
  setState(device: any, state: any) {
    const socket = new net.Socket();

    socket.connect(55443, device.ip, () => {
      const cmd =
        JSON.stringify({
          id: 1,
          method: 'set_power',
          params: [state.on ? 'on' : 'off'],
        }) + '\r\n';

      socket.write(cmd);
      socket.end();
    });
  }
}
