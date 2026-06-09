import DeviceCard from "./DeviceCard"

export default function DevicesGrid({ devices }: any) {

  return (
    <div className="min-h-screen bg-[#02050A] text-cyan-400 p-4">

      <h1 className="mb-4 text-xl tracking-widest">
        AR CONTROL GRID
      </h1>

      <div className="grid grid-cols-4 gap-4">

        {devices.map((d: any) => (
          <DeviceCard key={d.id} device={d} />
        ))}

      </div>

    </div>
  )
}