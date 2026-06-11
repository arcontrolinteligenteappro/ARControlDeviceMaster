// src/renderer/src/components/ActiveControlGrid.tsx
import bgConectados from '../assets/bg_conectados.png'

type Props = {
  devices: any[]
}

export default function ActiveControlGrid({ devices }: Props) {
  return (
    <div
      className="flex-1 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(${bgConectados})` }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      {/* El resto de la UI para los dispositivos conectados irá aquí, sobre el fondo oscuro */}
      <div className="relative z-10 p-4 text-white">
        <h1 className="text-2xl">Dispositivos Conectados: {devices.length}</h1>
        {/* Aquí irían las tarjetas de telemetría */}
      </div>
    </div>
  )
}