import React, { useState, useEffect } from 'react';

// Definimos un tipo para nuestros dispositivos para mayor claridad y seguridad de tipos.
type Device = {
  id: string;
  name: string;
  provider: string;
};

const IoTView: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        console.log(
          '[UI] Pidiendo la lista de dispositivos al proceso principal...',
        );
        const result = await window.api.iot.getDevices();
        console.log('[UI] Dispositivos recibidos:', result);
        setDevices(result);
      } catch (err) {
        console.error('[UI] Error al obtener los dispositivos:', err);
        setError('No se pudieron cargar los dispositivos.');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []); // El array vacío asegura que esto se ejecute solo una vez, al montar el componente.

  const handleSetState = async (device: Device, state: { power: boolean }) => {
    console.log(
      `[UI] Cambiando estado para ${device.provider}:${device.id} a ${JSON.stringify(state)}`,
    );
    try {
      const result = await window.api.iot.setDeviceState(device, state);
      console.log('[UI] Resultado del cambio de estado:', result);
      // Opcional: podrías querer actualizar el estado del dispositivo aquí si el backend no lo empuja.
    } catch (err) {
      console.error(
        `[UI] Error al cambiar el estado del dispositivo ${device.id}:`,
        err,
      );
      // Mostrar feedback al usuario sería una buena mejora.
    }
  };

  if (loading) {
    return <div>Cargando dispositivos IoT...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Panel de Control IoT</h2>
      {devices.length === 0 ? (
        <p>
          No se encontraron dispositivos IoT. Asegúrate de que tus credenciales
          son correctas y los dispositivos están en línea.
        </p>
      ) : (
        devices.map((device) => (
          <div
            key={device.id}
            style={{
              border: '1px solid #ccc',
              margin: '10px',
              padding: '15px',
              borderRadius: '8px',
            }}
          >
            <strong>{device.name}</strong>
            <p>
              <small>ID: {device.id}</small>
            </p>
            <p>
              <small>Proveedor: {device.provider}</small>
            </p>
            <button
              onClick={() => handleSetState(device, { power: true })}
              style={{ marginRight: '10px' }}
            >
              Encender
            </button>
            <button onClick={() => handleSetState(device, { power: false })}>
              Apagar
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default IoTView;
