import React from 'react';
import styles from './TacticalGrid.module.css';

export const TacticalGrid: React.FC<{ devices: any[] }> = ({ devices }) => {
  return (
    <div className={styles.gridContainer}>
      {devices.map((device) => (
        <div key={device.id} className={styles.deviceCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.modelName}>{device.model}</h3>
            <span className={styles.deviceId}>{device.id}</span>
          </div>

          <div className={styles.liveFeedPlaceholder}>
            <span className={styles.feedText}>[ LIVE FEED ACTIVE ]</span>
          </div>

          <div className={styles.buttonGroup}>
            <button
              onClick={() => window.electronAPI.captureScreen(device.id)}
              className={`${styles.actionButton} ${styles.btnCapture}`}
            >
              CAPTURA
            </button>
            <button
              onClick={() => window.electronAPI.openShell(device.id)}
              className={`${styles.actionButton} ${styles.btnShell}`}
            >
              SHELL
            </button>
            <button
              onClick={() => window.electronAPI.startForensic(device.id)}
              className={`${styles.actionButton} ${styles.btnForensic}`}
            >
              FORENSE
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TacticalGrid;
