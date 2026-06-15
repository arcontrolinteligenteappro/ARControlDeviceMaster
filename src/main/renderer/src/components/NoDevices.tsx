import React from 'react';
import bg from '../assets/bg_sindispositivos.png';
import styles from './NoDevices.module.css';

export default function NoDevices() {
  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className={styles.noDevicesContainer}
    >
      <div className={styles.radarBase}>
        <div className={styles.pingEffect}></div>
        <div className={styles.radarInner}></div>
      </div>

      <p className={styles.scanningText}>ESCANEANDO DISPOSITIVOS...</p>
    </div>
  );
}
