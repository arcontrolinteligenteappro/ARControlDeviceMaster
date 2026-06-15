import React from 'react';
import { CoreMap } from './CoreMap';
import styles from './RadarInterface.module.css';

export const RadarInterface: React.FC = () => {
  return (
    <div className={styles.radarContainer}>
      {/* 1. PANEL DE TELEMETRÍA */}
      <div className={styles.telemetryGrid}>
        {['CPU', 'RAM', 'DISK', 'NETWORK'].map((label) => (
          <div key={label} className={styles.telemetryCard}>
            <span className={styles.labelSmall}>{label}</span>
            <div className={styles.cardValue}>
              {Math.floor(Math.random() * 40 + 30)}%
            </div>
            <div className={styles.bar} />
          </div>
        ))}
      </div>

      {/* 2. ZONA CENTRAL */}
      <div className={styles.centralZone}>
        <CoreMap />
        <div className={styles.overlayText}>
          <h1 className={styles.overlayTitle}>AR CONTROL</h1>
          <p className={styles.overlaySubtitle}>SISTEMA LISTO PARA CONEXIÓN</p>
        </div>
      </div>

      {/* 3. TERMINAL SHELL */}
      <div className={styles.terminal}>
        <p className={styles.terminalLine}>
          &gt; Initializing ADB bridge... [OK]
        </p>
        <p className={styles.terminalLine}>
          &gt; Scanning for local nodes... [IDLE]
        </p>
        <p className={styles.terminalPrompt}>root@android:/system/bin# _</p>
      </div>
    </div>
  );
};
