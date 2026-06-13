import React, { useState, useEffect } from 'react';
import DeviceList from './DeviceList';
import ScrcpyView from './ScrcpyView';
import GamingView from './GamingView'; // Importar GamingView
import IoTView from '../views/IoTView'; // Importar IoTView

type Props = {
  devices: any[];
};

type ActiveView =
  | { type: 'none' }
  | { type: 'scrcpy'; deviceId: string }
  | { type: 'gaming'; deviceId: string };

export default function ActiveControlGrid({ devices }: Props) {
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'none' });

  useEffect(() => {
    const handleScrcpyStart = (deviceId: string) => {
      // No cambiar automáticamente la vista si ya estamos en modo gaming
      if (activeView.type !== 'gaming') {
        setActiveView({ type: 'scrcpy', deviceId });
      }
    };
    const handleGamingStart = (deviceId: string) =>
      setActiveView({ type: 'gaming', deviceId });

    const scrcpyListener = window.electron.ipcRenderer.on(
      'scrcpy:started',
      handleScrcpyStart,
    );
    const gamingListener = window.electron.ipcRenderer.on(
      'gaming-session-started',
      handleGamingStart,
    );

    // return () => {
    //   scrcpyListener.remove();
    //   gamingListener.remove();
    // };
  }, [activeView.type]);

  const handleClose = () => {
    if (activeView.type === 'scrcpy') {
      window.electron.ipcRenderer.send('scrcpy:stop', activeView.deviceId);
    }
    if (activeView.type === 'gaming') {
      window.electron.ipcRenderer.send(
        'stop-gaming-session',
        activeView.deviceId,
      );
    }
    setActiveView({ type: 'none' });
  };

  const renderActiveView = () => {
    switch (activeView.type) {
      case 'scrcpy':
        return (
          <ScrcpyView deviceId={activeView.deviceId} onClose={handleClose} />
        );
      case 'gaming':
        return (
          <GamingView deviceId={activeView.deviceId} onClose={handleClose} />
        );
      case 'none':
      default:
        return (
          <div className="relative z-10 p-8 text-white w-full h-full overflow-y-auto">
            <header className="mb-8">
              <h1 className="text-4xl font-thin tracking-wider">AR CONTROL</h1>
              <p className="text-sm text-cyan-300">DEVICE MASTER</p>
            </header>
            <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-light mb-4">
                  Dispositivos Conectados
                </h2>
                <DeviceList />
              </div>
              <div>
                <h2 className="text-2xl font-light mb-4">
                  Automatización del Hogar
                </h2>
                <IoTView />
              </div>
            </main>
          </div>
        );
    }
  };

  return (
    <div
      className="flex-1 w-full h-full bg-cover bg-center"
      style={{ backgroundImage: `url(./resources/bg_conectados.png)` }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {renderActiveView()}
    </div>
  );
}
