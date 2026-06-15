import React from 'react';
import styles from './DeviceControl.module.css';

export default function DeviceControl({ device }: any) {
  const ip = device.ip;

  return (
    <div className={styles.controlContainer}>
      <h3 className={styles.title}>{ip}</h3>

      <button
        className={styles.actionBtn}
        onClick={() => window.api.connectDevice(ip)}
      >
        Conectar
      </button>

      <div className={styles.navGrid}>
        <button
          className={styles.btn}
          onClick={() => window.api.sendNav(ip, 'up')}
        >
          ↑
        </button>
        <div className={styles.navRow}>
          <button
            className={styles.btn}
            onClick={() => window.api.sendNav(ip, 'left')}
          >
            ←
          </button>
          <button
            className={styles.btn}
            onClick={() => window.api.sendNav(ip, 'enter')}
          >
            OK
          </button>
          <button
            className={styles.btn}
            onClick={() => window.api.sendNav(ip, 'right')}
          >
            →
          </button>
        </div>
        <button
          className={styles.btn}
          onClick={() => window.api.sendNav(ip, 'down')}
        >
          ↓
        </button>
      </div>

      <div className={styles.appGroup}>
        <button
          className={styles.btn}
          onClick={() => window.api.sendNav(ip, 'back')}
        >
          BACK
        </button>
        <button
          className={styles.btn}
          onClick={() => window.api.sendNav(ip, 'home')}
        >
          HOME
        </button>
      </div>

      <div className={styles.appGroup}>
        <button
          className={styles.btn}
          onClick={() => window.api.openApp(ip, 'com.netflix.ninja')}
        >
          Netflix
        </button>
        <button
          className={styles.btn}
          onClick={() =>
            window.api.openApp(ip, 'com.google.android.youtube.tv')
          }
        >
          YouTube
        </button>
      </div>

      <button
        className={styles.actionBtn}
        onClick={() => window.api.gameStart(device.ip)}
      >
        MODO JUEGO
      </button>
      <button
        className={styles.actionBtn}
        onClick={() => window.api.sendText(ip, 'Hola Mundo')}
      >
        Enviar Texto
      </button>
    </div>
  );
}
