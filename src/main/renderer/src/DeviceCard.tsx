import React from 'react';
import styles from '../App.module.css';
import { Device, DeviceState } from '../types';

interface DeviceCardProps {
  device: Device;
  onLaunchStream: (id: string) => void;
  onSetActiveForensicDevice: (id: string) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onLaunchStream,
  onSetActiveForensicDevice,
}) => {
  const isOnline = device.state === DeviceState.Online;

  return (
    <div className={styles.deviceCard}>
      <h3 className={styles.deviceModel}>{device.model}</h3>
      <div className={styles.deviceInfo}>
        <p>ID: {device.id}</p>
        <p>
          ESTADO;{' '}
          <span
            className={
              isOnline ? styles.statusOnline : styles.statusOffline
            }
          >
            {isOnline ? 'EN LÍNEA' : 'DESCONECTADO'}
          </span>
        </p>
      </div>

      <div className={styles.cardActions}>
        <button
          onClick={() => isOnline && onLaunchStream(device.id)}
          className={`${styles.buttonBase} ${styles.btnMirror}`}
          disabled={!isOnline}
        >
          ESPEJO
        </button>
        <button
          onClick={() => isOnline && onSetActiveForensicDevice(device.id)}
          className={`${styles.buttonBase} ${styles.btnForensic}`}
          disabled={!isOnline}
        >
          FORENSE
        </button>
      </div>
    </div>
  );
};