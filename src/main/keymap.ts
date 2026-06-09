import { exec } from "child_process"

function tap(ip: string, x: number, y: number) {
  exec(`adb -s ${ip} shell input tap ${x} ${y}`)
}

export function handleKey(ip: string, key: string) {

  const map: any = {
    w: [500, 300],
    s: [500, 700],
    a: [200, 500],
    d: [800, 500]
  }

  const pos = map[key]

  if (pos) {
    tap(ip, pos[0], pos[1])
  }

}
