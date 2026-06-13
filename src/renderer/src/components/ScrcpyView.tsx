import React, { useEffect, useRef } from 'react';

interface ScrcpyViewProps {
  deviceId: string;
  onClose: () => void;
}

const ScrcpyView: React.FC<ScrcpyViewProps> = ({ deviceId, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Lógica para conectar el stream de video de scrcpy al elemento de video.
    // Esto es un placeholder. En una implementación real, aquí se conectaría
    // el stream de video (ej. WebRTC, o un stream directo si es posible con Electron)
    // que el backend nos proporcionaría para este deviceId.

    // Por ahora, simularemos un stream con un color de fondo.
    const video = videoRef.current;
    if (video) {
      video.style.backgroundColor = 'black';
    }

    // Escuchar evento de cierre desde el backend
    const handleScrcpyStopped = (id: string) => {
      if (id === deviceId) {
        onClose();
      }
    };

    const listener = window.electron.ipcRenderer.on(
      'scrcpy:stopped',
      handleScrcpyStopped,
    );

    return () => {
      // Limpiar el listener al desmontar el componente
      // listener.remove(); // La API de preload no expone un método remove
    };
  }, [deviceId, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl w-3/4 max-w-4xl">
        <div className="p-4 bg-gray-800 flex justify-between items-center">
          <h2 className="text-white font-bold">Screen Mirror - {deviceId}</h2>
          <button onClick={onClose} className="text-white font-bold">
            X
          </button>
        </div>
        <video ref={videoRef} autoPlay playsInline className="w-full" />
      </div>
    </div>
  );
};

export default ScrcpyView;
