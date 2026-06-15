import React, { useState } from 'react';
import { useADB } from './hooks/useADB';
import { VideoPlayer } from './components/VideoPlayer';
import { IntroScreen } from './components/IntroScreen';
import { ForensicPanel } from './components/ForensicPanel';
import { DeviceCard } from './components/DeviceCard';
import { Device, DeviceState } from './types';
import styles from './App.module.css';

export default function App(): JSX.Element {
  const { devices, isLoading, scanDevices, connectManual } = useADB();

  const [ipInput, setIpInput] = useState('');
  const [portInput, setPortInput] = useState('5555');
  const [showIntro, setShowIntro] = useState(true);

  const [activeStreamDevice, setActiveStreamDevice] = useState<string | null>(
    null,
  );
  const [activeForensicDevice, setActiveForensicDevice] = useState<
    string | null
  >(null);
  const [manualConnectFeedback, setManualConnectFeedback] = useState<{
    status: 'idle' | 'connecting' | 'success' | 'error';
    message: string | null;
  }>({ status: 'idle', message: null });

  const onLaunchStream = (id: string) => {
    setActiveStreamDevice(id);
  };

  const onCloseStream = () => {
    setActiveStreamDevice(null);
  };

  const onCloseForensic = () => {
    setActiveForensicDevice(null);
  };

  const onSubmitConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ipInput && portInput) {
      setManualConnectFeedback({ status: 'connecting', message: 'Conectando...' });
      try {
        await connectManual(ipInput, portInput);
        setManualConnectFeedback({ status: 'success', message: 'Conexión exitosa!' });
        setIpInput('');
        setPortInput('5555');
      } catch (error: any) {
        setManualConnectFeedback({ status: 'error', message: `Error de conexión: ${error.message || 'Desconocido'}` });
      }
    }
  };

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  if (activeStreamDevice) {
    return (
      <div className={styles.appContainer}>
        <VideoPlayer
          deviceId={activeStreamDevice}
          isStreaming={true}
          onClose={onCloseStream}
        />
      </div>
    );
  }

  if (activeForensicDevice) {
    return (
      <div className={styles.appContainer}>
        <ForensicPanel
          deviceId={activeForensicDevice}
          onClose={onCloseForensic}
        />
      </div>
    );
  }

  return (
    <div className={styles.appContainer}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>AR CONTROL DEVICE MASTER</h1>
          <span className={styles.subtitle}>
            MODO PRODUCCIÓN // ESTACI ÓN MAESTRA
          </span>
        </div>
        <button
          onClick={scanDevices}
          disabled={isLoading}
          className={`${styles.buttonBase} ${styles.btnScan}`}
        >
          {isLoading ? 'ESCANEANDO...' : 'ESCANEAR ADB LOCAL'}
        </button>
      </header>

      <section className={styles.tacticalSection}>
        <h3 className={styles.tacticalTitle}>INYECCIóN TÁCTICA TCP/IP</h3>
        <form onSubmit={onSubmitConnect} className={styles.formWrapper}>
          <input
            type="text"
            className={`${styles.buttonBase} ${styles.inputField}`}
            placeholder="IP"
            value={ipInput}
            onChange={(e) => setIpInput(e.target.value)}
          />
          <input
            className={`${styles.buttonBase} ${styles.inputPort}`}
            type="text"
            placeholder="Puerto"
            value={portInput}
            onChange={(e) => setPortInput(e.target.value)}
          />
          <button
            type="submit"
            className={`${styles.buttonBase} ${styles.btnSubmit}`}
            disabled={isLoading}
          >
            CONECTAR
          </button>
        </form>
      </section>

      <div className={styles.gridDevices}>
        {devices.map((device: Device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onLaunchStream={onLaunchStream}
            onSetActiveForensicDevice={setActiveForensicDevice}
          />
        ))}
      </div>
    </div>
  );
}
