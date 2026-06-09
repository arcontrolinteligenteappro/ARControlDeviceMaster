import fs from "fs"
import path from "path"

const configPath = path.join(
  process.cwd(),
  "projects",
  "house_001",
  "config.json"
)

function ensureConfig() {
  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ devices: [] }, null, 2))
  }
}

export function loadConfig() {
  ensureConfig()
  return JSON.parse(fs.readFileSync(configPath, "utf-8"))
}

export function saveConfig(data: any) {
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2))
}

export function getDevices() {
  return loadConfig().devices
}

export function addDevice(device: any) {
  const json = loadConfig()

  const exists = json.devices.find((d: any) => d.id === device.id)

  if (!exists) {
    json.devices.push(device)
  }

  saveConfig(json)

  return json.devices
}

// ✅ FIX ERRORES
export function exportConfig(dest: string) {
  fs.copyFileSync(configPath, dest)
}

export function importConfig(src: string) {
  fs.copyFileSync(src, configPath)
}