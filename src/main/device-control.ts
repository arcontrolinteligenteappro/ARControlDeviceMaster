import { exec } from "child_process"

function run(cmd: string) {
  exec(cmd, (err) => {
    if (err) console.error("ADB ERROR:", err)
  })
}

export function connectIP(ip: string) {
  run(`adb connect ${ip}`)
}

export function nav(ip: string, action: string) {

  const map: any = {
    up: 19,
    down: 20,
    left: 21,
    right: 22,
    enter: 23,
    back: 4,
    home: 3
  }

  const key = map[action]

  if (key) {
    run(`adb -s ${ip} shell input keyevent ${key}`)
  }
}

export function openApp(ip: string, pkg: string) {
  run(`adb -s ${ip} shell monkey -p ${pkg} -c android.intent.category.LAUNCHER 1`)
}

export function sendText(ip: string, text: string) {
  const safe = text.replace(/ /g, "%s")
  run(`adb -s ${ip} shell input text ${safe}`)
}