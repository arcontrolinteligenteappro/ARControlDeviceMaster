import { Net } from 'electron';
import { EventEmitter } from 'events';
import { networkInterfaces } from 'os';

interface NetworkScannerServiceOptions {
  port?: number;
  timeout?: number;
  maxConcurrentProbes?: number;
  net: Net;
}

export class NetworkScannerService extends EventEmitter {
  private readonly port: number;
  private readonly timeout: number;
  private readonly maxConcurrentProbes: number;
  private readonly net: Net;
  private activeProbes = 0;
  private ipQueue: string[] = [];

  constructor(options: NetworkScannerServiceOptions) {
    super();
    this.port = options.port ?? 5555; // Default ADB wireless port
    this.timeout = options.timeout ?? 1500;
    this.maxConcurrentProbes = options.maxConcurrentProbes ?? 50;
    this.net = options.net;
  }

  /**
   * Starts a scan on all non-internal local subnets.
   */
  public startScan() {
    console.log('[NetworkScanner] Starting network scan for ADB devices...');
    const subnets = this.getLocalSubnets();

    if (subnets.size === 0) {
      console.warn('[NetworkScanner] No valid local subnets found to scan.');
      return;
    }

    console.log(
      `[NetworkScanner] Scanning the following subnets: ${[...subnets].join(', ')}`,
    );

    this.ipQueue = [];
    for (const subnet of subnets) {
      for (let i = 1; i < 255; i++) {
        this.ipQueue.push(`${subnet}.${i}`);
      }
    }

    this.processQueue();
  }

  private processQueue() {
    while (
      this.activeProbes < this.maxConcurrentProbes &&
      this.ipQueue.length > 0
    ) {
      const ip = this.ipQueue.shift();
      if (ip) {
        this.activeProbes++;
        this.probe(ip);
      }
    }

    if (this.ipQueue.length === 0 && this.activeProbes === 0) {
      console.log('[NetworkScanner] Network scan finished.');
      this.emit('scan-finished');
    }
  }

  /**
   * Gets a set of all local IPv4 subnets (e.g., '192.168.1').
   */
  private getLocalSubnets(): Set<string> {
    const subnets = new Set<string>();
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
      const ifaceGroup = interfaces[name];
      if (ifaceGroup) {
        for (const iface of ifaceGroup) {
          // We are only interested in non-internal IPv4 addresses.
          if (iface.family === 'IPv4' && !iface.internal) {
            const subnet = iface.address.substring(
              0,
              iface.address.lastIndexOf('.'),
            );
            subnets.add(subnet);
          }
        }
      }
    }

    return subnets;
  }

  /**
   * Probes a specific IP and port to see if the connection is successful.
   * @param ip The IP address to probe.
   */
  private probe(ip: string) {
    const socket = this.net.createConnection(
      { host: ip, port: this.port, timeout: this.timeout },
      () => {
        // If the connection is successful, the port is open.
        socket.end();
        console.log(`[NetworkScanner] Device found at ${ip}:${this.port}`);
        this.emit('device-found', ip);
        this.activeProbes--;
        this.processQueue();
      },
    );

    // We expect connection errors (e.g., ECONNREFUSED), so we'll just log them.
    socket.on('error', (err) => {
      // console.log(`[NetworkScanner] Error probing ${ip}:${this.port} - ${err.message}`);
      socket.destroy();
      this.activeProbes--;
      this.processQueue();
    });

    socket.on('timeout', () => {
      socket.destroy();
      this.activeProbes--;
      this.processQueue();
    });
  }
}
