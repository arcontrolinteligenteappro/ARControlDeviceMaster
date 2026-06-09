import { ipcMain } from "electron"
import { spawn, ChildProcessWithoutNullStreams } from "child_process"

// 🔥 shells persistentes
const activeShells = new Map<string, ChildProcessWithoutNullStreams>()

export function setupMultiControl() {

  // ✅ BROADCAST (comandos paralelos)
  ipcMain.handle("multi:broadcast", async (_, ips: string[], command: string) => {

    const args = command.split(" ")

    await Promise.all(
      ips.map(ip => {
        return new Promise((resolve) => {

          const proc = spawn("adb", ["-s", ip, "shell", ...args])

          proc.on("close", () => resolve(true))
          proc.on("error", () => resolve(false))

        })
      })
    )

    return true
  })


  // ✅ STREAM (baja latencia 🔥)
  ipcMain.handle("multi:stream", (_, ips: string[], cmd: string) => {

    ips.forEach(ip => {

      let shell = activeShells.get(ip)

      if (!shell || shell.killed) {

        shell = spawn("adb", ["-s", ip, "shell"])
        activeShells.set(ip, shell)

        shell.on("exit", () => activeShells.delete(ip))
        shell.on("error", () => activeShells.delete(ip))
      }

      shell.stdin.write(cmd + "\n")

    })

    return true
  })


  // ✅ cerrar streams
  ipcMain.handle("multi:close", (_, ips: string[]) => {

    ips.forEach(ip => {
      const shell = activeShells.get(ip)
      if (shell) {
        shell.kill()
        activeShells.delete(ip)
      }
    })

    return true
  })

}