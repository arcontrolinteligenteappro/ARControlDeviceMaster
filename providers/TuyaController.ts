import fetch from "node-fetch"

export class TuyaController {

  async setState(device: any, state: any) {

    await fetch(`https://api.tuya.com/device/${device.id}`, {
      method: "POST",
      body: JSON.stringify(state)
    })

  }

}
