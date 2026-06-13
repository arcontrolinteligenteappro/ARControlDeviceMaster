export {};

declare global {
  interface Window {
    api: {
      getDevices: () => Promise<any[]>;
      addDevice: (device: any) => Promise<any[]>;

      getSystemStatus: () => Promise<any>;

      connectDevice: (ip: string) => Promise<void>;
      sendNav: (ip: string, action: string) => Promise<void>;
      openApp: (ip: string, pkg: string) => Promise<void>;
      sendText: (ip: string, text: string) => Promise<void>;

      gameStart: (ip: string) => Promise<void>;
      sendGameKey: (ip: string, key: string) => Promise<void>;

      multiBroadcast: (ips: string[], cmd: string) => Promise<void>;
      multiStream: (ips: string[], cmd: string) => Promise<void>;
      multiClose: (ips: string[]) => Promise<void>;
    };
  }
}
