import { spawn } from "child_process"

export function startGameMode(ip: string) {

  console.log("🎮 Iniciando modo juego:", ip)

  // ✅ conectar ADB
  spawn("adb", ["connect", ip])

  // ✅ lanzar scrcpy optimizado
  spawn("scrcpy", [
    "-s", ip,
    "--max-fps=60",
    "--bit-rate=16M",
    "--window-title=GAME-" + ip,
    "--stay-awake",
    "--no-audio-playback=false"
  ])

}