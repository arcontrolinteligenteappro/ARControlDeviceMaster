import { exec } from 'child_process';
import { networkInterfaces } from 'os';

class AdbService {
  private adbPath: string;

  constructor(adbPath = 'adb') {
    this.adbPath = adbPath;
  }

  public async listDevices(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      exec(`${this.adbPath} devices`, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        const lines = stdout.trim().split('\n').slice(1);
        const devices = lines.map((line) => line.split('\t')[0]);
        resolve(devices);
      });
    });
  }

  public async connect(host: string, port: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(`${this.adbPath} connect ${host}:${port}`, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.includes('connected'));
      });
    });
  }

  public async disconnect(host: string, port: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      exec(`${this.adbPath} disconnect ${host}:${port}`, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout.includes('disconnected'));
      });
    });
  }

  public async getDeviceProperties(device: string): Promise<any> {
    return new Promise((resolve, reject) => {
      exec(`${this.adbPath} -s ${device} shell getprop`, (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }
        const properties = {};
        stdout
          .trim()
          .split('\n')
          .forEach((line) => {
            const match = line.match(/\[(.*?)\]: \[(.*?)\]/);
            if (match) {
              properties[match[1]] = match[2];
            }
          });
        resolve(properties);
      });
    });
  }

  public async scanNetwork(): Promise<string[]> {
    const devices: string[] = [];
    const interfaces = networkInterfaces();
    const promises = [];

    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]!) {
        if (net.family === 'IPv4' && !net.internal) {
          const subnet = net.address.substring(0, net.address.lastIndexOf('.'));
          for (let i = 1; i < 255; i++) {
            const host = `${subnet}.${i}`;
            promises.push(
              this.connect(host, 5555).then((connected) => {
                if (connected) {
                  devices.push(host);
                }
              }),
            );
          }
        }
      }
    }

    await Promise.all(promises);
    return devices;
  }
}

export const adbService = new AdbService();
