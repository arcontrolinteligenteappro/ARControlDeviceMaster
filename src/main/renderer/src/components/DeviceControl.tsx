export default function DeviceControl({ device }: any) {

  const ip = device.ip

  return (
    <div className="border p-2 text-xs text-cyan-400">

      <h3>{ip}</h3>

      <button onClick={() => window.api.connectDevice(ip)}>
        Conectar
      </button>

      <div>
        <button onClick={() => window.api.sendNav(ip, "up")}>↑</button>
      </div>

      <div>
        <button onClick={() => window.api.sendNav(ip, "left")}>←</button>
        <button onClick={() => window.api.sendNav(ip, "enter")}>OK</button>
        <button onClick={() => window.api.sendNav(ip, "right")}>→</button>
      </div>

      <div>
        <button onClick={() => window.api.sendNav(ip, "down")}>↓</button>
      </div>

      <button onClick={() => window.api.sendNav(ip, "back")}>
        BACK
      </button>

      <button onClick={() => window.api.sendNav(ip, "home")}>
        HOME
      </button>

      <button onClick={() =>
        window.api.openApp(ip, "com.netflix.ninja")
      }>
        Netflix
      </button>

      <button onClick={() =>
        window.api.openApp(ip, "com.google.android.youtube.tv")
      }>
        YouTube
<button onClick={() => window.api.gameStart(device.ip)}><button onClick={() => window.api.gameStart(device MODO JUEGO
</button>

        
      </button>

      <button onClick={() =>
        window.api.sendText(ip, "Hola Mundo")
      }>
        Texto
      </button>

    </div>
  )
}
``