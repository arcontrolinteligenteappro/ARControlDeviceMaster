import React, { useState } from 'react';
import { useADB } from './hooks/useADB';
import { IntroScreen } from './components/IntroScreen';
import { VideoPlayer } from './components/VideoPlayer';
import styles from './App.module.css';

export default function App() {
  // Lógica real de ADB
  const { devices, handleLaunchStream, handleCloseStream } = useADB();
  const [showIntro, setShowIntro] = useState(true);
  const [activeStreamDevice, setActiveStreamDevice] = useState<string | null>(null);

  // Funciones puente
  const onLaunchStream = (deviceId: string) => {
    setActiveStreamDevice(deviceId);
    if (handleLaunchStream) handleLaunchStream(deviceId);
  };

  const onCloseStream = () => {
    setActiveStreamDevice(null);
    if (handleCloseStream) handleCloseStream();
  };

  const handleForensic = (deviceId: string) => {
    console.log('Iniciando extracción forense en:', deviceId);
  };

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  // Reproductor a pantalla completa
  if (activeStreamDevice) {
    return (
      <div className={styles.appContainer} style={{ padding: 0 }}>
        <VideoPlayer 
          deviceId={activeStreamDevice} 
          isStreaming={true} 
          onClose={onCloseStream} 
        />
      </div>
    );
  }

  const hasDevices = devices && devices.length > 0;

  return (
    <div className={styles.appContainer}>
      <main className={styles.mainContent}>
        {!hasDevices ? (
          <div className={styles.emptyState}>
            <h1 className={styles.mainLogo}>AR DEVICE CONTROL</h1>
            <h2 className={styles.subTitle}>SYSTEM STANDBY - WAITING FOR TARGET</h2>
            <div className={styles.decorativePanels}>
              <button className={styles.panelButton}>ROOT ACCESS</button>
              <button className={styles.panelButton}>FORENSIC</button>
              <button className={styles.panelButton}>MTP MODE</button>
              <button className={styles.panelButton}>DEBLOAT</button>
            </div>
          </div>
        ) : (
          <div className={styles.devicesState}>
            <h2 className={styles.subTitle}>TARGETS ACQUIRED: {devices.length}</h2>
            <div className={styles.gridDevices}>
              {devices.map((device: any, index: number) => {
                const displayIp = \192.168.20.\\;
                const deviceModel = device.model || \Dispositivo Desconocido\;

                return (
                  <div key={device.id} className={styles.deviceCard}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.deviceModel}>{deviceModel}</h3>
                      <span className={styles.deviceIp}>{displayIp}</span>
                    </div>
                    <div className={styles.cardActions}>
                      <button 
                        className={\\ \\}
                        onClick={() => onLaunchStream(device.id)}
                      >
                        MIRRORING
                      </button>
                      <button 
                        className={styles.actionBtn}
                        onClick={() => handleForensic(device.id)}
                      >
                        FORENSE
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <span className={styles.prompt}>&gt;_</span>
        <span className={styles.typewriterText}>
          Elaborado Por ChrisRey91  /  www.arcontrolinteligente.com
        </span>
      </footer>
    </div>
  );
}
