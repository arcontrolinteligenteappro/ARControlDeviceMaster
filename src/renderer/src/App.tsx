import React, { useState } from 'react';
import { useADB } from './hooks/useADB';
import { IntroScreen } from './components/IntroScreen';
import { VideoPlayer } from './components/VideoPlayer';
import styles from './App.module.css';

export default function App() {
  const { devices, handleLaunchStream, handleCloseStream } = useADB();
  const [showIntro, setShowIntro] = useState(true);
  const [activeStreamDevice, setActiveStreamDevice] = useState<string | null>(null);

  const onLaunchStream = (deviceId: string) => {
    setActiveStreamDevice(deviceId);
    if (handleLaunchStream) handleLaunchStream(deviceId);
  };

  const onCloseStream = () => {
    setActiveStreamDevice(null);
    if (handleCloseStream) handleCloseStream();
  };

  const handleForensic = (deviceId: string) => {
    console.log(\"Iniciando extracción forense en: \" + deviceId);
  };

  if (showIntro) {
    return <IntroScreen onComplete={() => setShowIntro(false)} />;
  }

  if (activeStreamDevice) {
    return ((�������؁�����9�������展̹�����х�������屔����������������(���������Y����A���Ȁ(������������٥��%��텍ѥٕM�ɕ���٥���(������������M�ɕ���������Օ�(��������������͔������͕M�ɕ���(����������(������𽑥��(������(���((������Ё����٥��̀􁑕٥��̀�����٥��̹����Ѡ�����((��ɕ��ɸ����F�b6�74��S׷7G��W2�6��F��W'������6�74��S׷7G��W2����6��FV�G����4FWf�6W2����F�b6�74��S׷7G��W2�V�G�7FFW��ƃ6�74��S׷7G��W2������v���"DUd�4R4��E$������ƃ"6�74��S׷7G��W2�7V%F�F�W��5�5DT�5D�D%��t�D��rd�"D$tUC���#��F�b6�74��S׷7G��W2�FV6�&F�fU�V�7���'WGF��6�74��S׷7G��W2��V�'WGF����$��B44U53��'WGF����'WGF��6�74��S׷7G��W2��V�'WGF����d�$T�4�3��'WGF����'WGF��6�74��S׷7G��W2��V�'WGF�����E��DS��'WGF����'WGF��6�74��S׷7G��W2��V�'WGF����DT$��C��'WGF�����F�c���F�c������F�b6�74��S׷7G��W2�FWf�6W57FFW��ƃ"6�74��S׷7G��W2�7V%itle}>TARGETS ACQUIRED: {devices.length}</h2>
            <div className={styles.gridDevices}>
              {devices.map((device: any, index: number) => {
                const displayIp = \"192.168.20.\" + (10 + index);
                const deviceModel = device.model || \"Dispositivo Desconocido\";

                return (
                  <div key={device.id} className={styles.deviceCard}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.deviceModel}>{deviceModel}</h3>
                      <span className={styles.deviceIp}>{displayIp}</span>
                    </div>
                    <div className={styles.cardActions}>
                      <button 
                        className={styles.actionBtn + \" \" + styles.mirroringBtn}
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
        <span className={styles.prompt}>>_</span>
        <span className={styles.typewriterText}>
          Elaborado Por ChrisRey91  /  www.arcontrolinteligente.com
        </span>
      </footer>
    </div>
  );
}
