exports.onExecute = async (request) => {

  const { devices, execution } = request.inputs[0]

  return {
    commands: devices.map(device => ({
      ids: [device.id],
      status: "SUCCESS",
      states: { on: true }
    }))
  }

}