import { exec } from "child_process"

// 🔊 volumen
export function volumeUp(id: string) {
  exec(`adb -s ${id} shell input keyevent 24`)
}

export function volumeDown(id: string) {
  exec(`adb -s ${id} shell input keyevent 25`)
}

// 🔘 botones físicos
export function power(id: string) {
  exec(`adb -s ${id} shell input keyevent 26`)
}

export function home(id: string) {
  exec(`adb -s ${id} shell input keyevent 3`)
}

export function back(id: string) {
  exec(`adb -s ${id} shell input keyevent 4`)
}