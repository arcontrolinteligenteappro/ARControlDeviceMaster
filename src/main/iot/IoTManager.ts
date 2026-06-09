import { TuyaController } from "../../../providers/TuyaController"
import { SmartThingsController } from "../../../providers/SmartThingsController"
import { YeelightController } from "../../../providers/YeelightController"

export class IoTManager {

  tuya = new TuyaController()
  smart = new SmartThingsController()
  yeelight = new YeelightController()

  async setDeviceState(device: any, state: any) {

    switch (device.provider) {

      case "tuya":
        return this.tuya.setState(device, state)

      case "smartthings":
        return this.smart.setState(device, state)

      case "yeelight":
        return this.yeelight.setState(device, state)

    }

  }

}