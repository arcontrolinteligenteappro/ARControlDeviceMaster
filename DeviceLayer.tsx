export default function DeviceLayer({ devices }: any) {

  return (
    <>
      {devices.map((d: any) => (

        <div
          key={d.id}
          draggable
          style={{
            position: "absolute",
            left: d.x,
            top: d.y
          }}
          onDragEnd={(e) => {

            d.x = e.clientX
            d.y = e.clientY

          }}
        >
          💡
        </div>

      ))}
    </>
  )
}