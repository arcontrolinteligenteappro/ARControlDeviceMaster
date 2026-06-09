import { useEffect, useState } from "react"

export default function SystemStatus() {

  const [status, setStatus] = useState<any>({})

  useEffect(() => {

    const load = async () => {
      const res = await window.api.getSystemStatus()
      setStatus(res)
    }

    load()

    const interval = setInterval(load, 3000)

    return () => clearInterval(interval)

  }, [])

  return (
    <div className="border border-cyan-500 p-2 text-xs text-cyan-400">

      <h3>Estado del sistema</h3>

      <p>ADB: {status.adb ? "✅" : "❌"}</p>
      <p>Dispositivos USB/WiFi: {status.devicesCount || 0}</p>

      <p>IoT: {status.iot ? "✅" : "❌"}</p>
      <p>Sincronización: {status.mqtt ? "✅" : "❌"}</p>

    </div>
  )
}