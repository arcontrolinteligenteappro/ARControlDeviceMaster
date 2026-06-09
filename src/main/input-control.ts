import { exec } from "child_process"
import { exec } from "child_process"
import { getBinPath } from "./utils/paths"

function adb() {
  return `"${getBinPath("adb.exe")}"`
}

export function volumeUp(id: string) {
  exec(`${adb()} -s ${id} shell input keyevent 24`)
}

export function volumeDown(id: string) {
  exec(`${adb()} -s ${id} shell input keyevent 25`)
}

export function tap(id: string, x: number, y: number) {
  exec(`${adb()} -s ${id} shell input tap ${x} ${y}`)
}
``
export function sendTap(id: string, x: number, y: number) {
  exec(`adb -s ${id} shell input tap ${x} ${y}`)
}

export function sendSwipe(id: string, x1: number, y1: number, x2: number, y2: number) {
  exec(`adb -s ${id} shell input swipe ${x1} ${y1} ${x2} ${y2} 200`)
}

export function sendText(id: string, text: string) {
  exec(`adb -s ${id} shell input text "${text}"`)
}