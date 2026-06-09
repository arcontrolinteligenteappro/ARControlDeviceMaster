import { app } from "electron"
import path from "path"

export function getBinPath(file: string) {

  if (app.isPackaged) {
    return path.join(process.resourcesPath, "bin", file)
  }

  return path.join(process.cwd(), "resources/bin", file)
}