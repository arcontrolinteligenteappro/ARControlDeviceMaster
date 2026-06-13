import { useState } from 'react';

export default function ManualDeviceForm({ onUpdate }: any) {
  const [ip, setIp] = useState('');
  const [type, setType] = useState('android_tv');

  const handleAdd = async () => {
    if (!ip) {
      alert('Ingresa IP');
      return;
    }

    const device = {
      id: ip,
      ip,
      type,
    };

    const updated = await window.api.addDevice(device);

    onUpdate(updated);

    setIp('');
  };

  return (
    <div className="border p-2 text-xs text-cyan-400">
      <h3>Agregar dispositivo manual</h3>

      <input
        placeholder="IP (192.168.x.x)"
        value={ip}
        onChange={(e) => setIp(e.target.value)}
      />

      <select
        title="Tipo de dispositivo"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="android_tv">Android TV</option>
        <option value="yeelight">Yeelight</option>
      </select>

      <button onClick={handleAdd}>GUARDAR</button>
    </div>
  );
}
