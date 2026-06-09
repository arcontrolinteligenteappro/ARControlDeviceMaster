import { spawn } from "child_process"
import { spawn } from "child_process"
import { getBinPath } from "./utils/paths"

const streams: any = {}

export function startH264Stream(deviceId: string, win: any) {

  if (streams[deviceId]) return

  const scrcpy = getBinPath("scrcpy.exe")

  const proc = spawn(scrcpy, [
    "-s", deviceId,
    "--video-codec=h264",
    "--video-bit-rate=8M",
    "--max-fps=60",
    "--no-window",
    "--no-control",
    "--record=-"
const server = getBinPath("scrcpy-server")

const proc = spawn(scrcpy, [
  "-s", deviceId,

  `--server=${server}`,

  "--video-codec=h264",
  "--video-bit-rate=8M",
  "--max-fps=60",
  "--no-window",
  "--no-control",
  "--record=-"
])


  ])

  streams[deviceId] = proc

  proc.stdout.on("data", (chunk) => {
    win.send("scrcpy:h264", {
      id: deviceId,
      data: chunk.toString("base64")
    })
  })

  proc.stderr.on("data", (err) => {
    console.log("SCRCPY:", err.toString())
  })

  proc.on("close", () => {
    delete streams[deviceId]
  })
}
``

const clients: Record<string, any> = {}

export function startH264Stream(id: string, win: any) {

  if (clients[id]) return

  const proc = spawn("scrcpy", [
    "-s", id,

    "--video-codec=h264",
    "--video-bit-rate=8M",
    "--max-fps=60",
    "--no-control",
    "--no-window",

    "--record=-" // 🚀 H264 directo
  ])

  clients[id] = proc

  proc.stdout.on("data", (chunk) => {
    win.send("scrcpy:h264", {
      id,
      data: chunk.toString("base64")
    })
  })

  proc.on("close", () => {
    delete clients[id]
  })
}
``