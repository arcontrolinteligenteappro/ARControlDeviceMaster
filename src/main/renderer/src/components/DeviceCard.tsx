import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeviceCard.module.css';

export default function DeviceCard({ device }: any) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lógica de stream simplificada para el componente
  useEffect(() => {
    // ... tu lógica de MediaSource y window.api.scrcpyH264
  }, []);

  return (
    <div className={styles.cardContainer}>
      <p className={styles.deviceId}>{device.id}</p>
      <p className={styles.modelName}>{device.model}</p>

      <video ref={videoRef} autoPlay muted className={styles.videoPlayer} />

      <div className={styles.securityGrid}>
        <span
          className={
            device.security?.root ? styles.statusRootVoid : styles.statusRootOk
          }
        >
          Root: {device.security?.root ? t('yes') : t('no')}
        </span>
        <span title={device.security?.knox}>
          Knox: {device.security?.knox === '0x0' ? 'OK' : 'Void'}
        </span>
        <span>MDM: {device.security?.mdm}</span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.btnControl}
          onClick={() => window.api.volumeUp(device.id)}
        >
          VOL+
        </button>
        <button
          className={styles.btnControl}
          onClick={() => window.api.volumeDown(device.id)}
        >
          VOL-
        </button>
        <button
          className={styles.btnControl}
          onClick={() => window.api.power(device.id)}
        >
          PWR
        </button>
        <button
          className={styles.btnControl}
          onClick={() => window.api.home(device.id)}
        >
          HOME
        </button>
        <button
          className={styles.btnControl}
          onClick={() => window.api.back(device.id)}
        >
          BACK
        </button>
      </div>
    </div>
  );
}
