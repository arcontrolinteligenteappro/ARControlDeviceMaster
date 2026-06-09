import fetch from "node-fetch"

export class SmartThingsController {

  async setState(device: any, state: any) {

    await fetch(`https://api.smartthings.com/v1/devices/${device.id}/commands`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${device.token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        commands: [
          {
            capability: "switch",
            command: state.on ? "on" : "off"
          }
        ]
      })
    })

  }
}
