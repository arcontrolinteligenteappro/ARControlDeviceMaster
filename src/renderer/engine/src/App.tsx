import { useEffect, useState } from "react"

import ManualDeviceForm from "./components/ManualDeviceForm"
import SystemStatus from "./ 📱 dispositivosimport SystemStatus from "./components/SystemStatus"
  const [devices, setDevices] = useState<any[]>([])

  // 🎯 seleccionados (MULTICONTROL)
  const [selected, setSelected] = useState<string[]>([])

  // ✅ cargar dispositivos
  useEffect(() => {
    loadDevices()
  }, [])

  const loadDevices = async () => {
    const res = await window.api.getDevices()
    setDevices(res || [])
  }

  // ✅ seleccionar/deseleccionar dispositivo
  const toggle = (ip: string) => {
    setSelected(prev =>
      prev.includes(ip)
        ? prev.filter(x => x !== ip)
        : [...prev, ip]
    )
  }

  // 🎮 KEYBOARD MULTICONTROL
  useEffect(() => {

    const handler = (e: KeyboardEvent) => {

      if (selected.length === 0) return

      let cmd = ""

      switch (e.key.toLowerCase()) {
        case "w": cmd = "input tap 500 300"; break
        case "s": cmd = "input tap 500 700"; break
        case "a": cmd = "input tap 200 500"; break
        case "d": cmd = "input tap 800 500"; break
        case " ": cmd = "input keyevent 62"; break // espacio = botón acción
      }

      if (cmd) {
        window.api.multiStream(selected, cmd)
      }

    }

    window.addEventListener("keydown", handler)

    return () => {
      window.removeEventListener("keydown", handler)
    }

  }, [selected])

  // 🔴 limpiar streams al salir
  useEffect(() => {
    return () => {
      if (selected.length > 0) {
        window.api.multiClose(selected)
      }
    }
  }, [selected])

  return (
    <div className="p-4 text-cyan-400">

      <h1 className="text-xl mb-2">AR Control Device Master</h1>

      <SystemStatus />

      <ManualDeviceForm onUpdate={setDevices} />

      {/* 🔥 CONTROLES GLOBALES */}
      <div className="mt-4 mb-4">

        <button
          onClick={() => window.api.multiBroadcast(selected, "input keyevent 26")}
          className="border border-cyan-500 px-4 py-2 mr-2"
        >
          🔌 POWER TODOS
        </button>

        <span className="ml-2 text-sm">
          Seleccionados: {selected.length}
        </span>

      </div>

      {/* 📱 LISTA DE DISPOSITIVOS */}
      <div className="mt-2">

        <h3 className="mb-2">Dispositivos</h3>

        {devices.map((d, i) => (

          <div
            key={i}
            onClick={() => toggle(d.ip)}
            style={{
              border: selected.includes(d.ip)
                ? "2px solid cyan"
                : "1px solid gray",
              padding: "8px",
              marginBottom: "6px",
              cursor: "pointer"
            }}
          >
            <DeviceControl device={d} />
          </div>

        ))}

      </div>

    </div>
  )
}
import DeviceControl from "./components/DeviceControl"

export default function App() {

