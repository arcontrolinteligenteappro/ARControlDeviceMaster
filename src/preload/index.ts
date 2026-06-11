import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  // DOMINIO: SISTEMA Y CONECTIVIDAD
  sys: {
    reboot: (deviceId: string, mode: 'normal'|'recovery'|'fastboot'|'download'|'edl') => 
      ipcRenderer.invoke('sys:reboot', deviceId, mode),
    getTelemetry: (deviceId: string) => ipcRenderer.invoke('sys:getTelemetry', deviceId)
  },
  // DOMINIO: CONTROL Y MIRRORING (Baja Latencia)
  control: {
    startScrcpy: (config: any) => ipcRenderer.invoke('control:startScrcpy', config),
    sendInput: (deviceId: string, inputData: any) => ipcRenderer.invoke('control:sendInput', inputData), // Persistent Shell
    toggleScreenOff: (deviceId: string) => ipcRenderer.invoke('control:toggleScreenOff', deviceId),
    setPeripheralConfig: (config: any) => ipcRenderer.invoke('control:setPeripheralConfig', config)
  },
  // DOMINIO: APPS Y DEBLOAT
  apps: {
    installPackage: (deviceIds: string[], apkPath: string) => ipcRenderer.invoke('apps:installPackage', deviceIds, apkPath),
    analyzeApp: (deviceId: string, packageName: string) => ipcRenderer.invoke('apps:analyzeApp', deviceId, packageName),
    runDebloat: (deviceIds: string[], profile: 'google'|'samsung'|'carrier'|'oem') => 
      ipcRenderer.invoke('apps:runDebloat', deviceIds, profile)
  },
  // DOMINIO: FORENSE (Delegado a Workers)
  forensic: {
    startSQLiteCarving: (deviceId: string, dbName: string) => ipcRenderer.invoke('forensic:startSQLiteCarving', deviceId, dbName),
    startFileCarving: (deviceId: string, hexPattern: string) => ipcRenderer.invoke('forensic:startFileCarving', deviceId, hexPattern),
    analyzeLogcatWithAI: (rawLogs: string) => ipcRenderer.invoke('forensic:analyzeLogcatWithAI', rawLogs)
  },
  // DOMINIO: TELECOM
  telecom: {
    injectApn: (deviceIds: string[], apnConfig: any) => ipcRenderer.invoke('telecom:injectApn', deviceIds, apnConfig),
    injectDialerCode: (deviceId: string, code: string) => ipcRenderer.invoke('telecom:injectDialerCode', deviceId, code)
  }
})