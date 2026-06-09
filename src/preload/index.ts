import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("api", {

  // ✅ DEVICES
  getDevices: () => ipcRenderer.invoke("devices:get"),
  addDevice: (device: any) => ipcRenderer.invoke("devices:add", device),

  // ✅ SYSTEM
  getSystemStatus: () => ipcRenderer.invoke("system:status"),

  // ✅ SCRCPY
  scrcpyStream: (id: string) =>
    ipcRenderer.invoke("scrcpy:startStream", id),

  onFrame: (cb: any) =>
    ipcRenderer.on("scrcpy:frame", (_, data) => cb(data)),

  // ✅ INPUT
  tap: (data: any) =>
    ipcRenderer.invoke("input:tap", data),

  swipe: (data: any) =>
    ipcRenderer.invoke("input:swipe", data),

  // ✅ ADB
  connectDevice: (ip: string) =>
    ipcRenderer.invoke("device:connect", ip),

  sendNav: (ip: string, action: string) =>
    ipcRenderer.invoke("device:nav", { ip, action }),

  openApp: (ip: string, pkg: string) =>
    ipcRenderer.invoke("device:openApp", { ip, pkg }),

  sendText: (ip: string, text: string) =>
    ipcRenderer.invoke("device:text", { ip, text }),

  // 🎮 GAME
  gameStart: (ip: string) =>
    ipcRenderer.invoke("game:start", ip),

  sendGameKey: (ip: string, key: string) =>
    ipcRenderer.invoke("game:key", { ip, key }),

  // 🔥 MULTICONTROL
  multiBroadcast: (ips: string[], cmd: string) =>
    ipcRenderer.invoke("multi:broadcast", ips, cmd),

  multiStream: (ips: string[], cmd: string) =>
    ipcRenderer.invoke("multi:stream", ips, cmd),

  multiClose: (ips: string[]) =>
    ipcRenderer.invoke("multi:close", ips),

})