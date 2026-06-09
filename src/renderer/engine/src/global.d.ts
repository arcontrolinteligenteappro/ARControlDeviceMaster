export {}

declare global {
  interface Window {
    api: {

      // ✅ DISPOSITIVOS
      getDevices: () => Promise<any[]>
      addDevice: (device: any) => Promise<any[]>

      // ✅ SISTEMA
      getSystemStatus: () => Promise<any>

      // ✅ CONTROL ADB
      connectDevice: (ip: string) => Promise<void>
      sendNav: (ip: string, action: string) => Promise<void>
      openApp: (ip: string, pkg: string) => Promise<void>
      sendText: (ip: string, text: string) => Promise<void>

      // ✅ MODO JUEGO (INDIVIDUAL)
      gameStart: (ip: string) => Promise<void>
      sendGameKey: (ip: string, key: string) => Promise<void>

      // 🔥 MULTICONTROL (PRO)
      multiBroadcast: (ips: string[], cmd: string) => Promise<void>
      multiStream: (ips: string[], cmd: string) => Promise<void>
      multiClose: (ips: string[]) => Promise<void>

    }
  }
}