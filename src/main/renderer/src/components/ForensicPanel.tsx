import React, { useState, useEffect } from 'react';
import styles from './ForensicPanel.module.css';

interface ForensicPanelProps {
  deviceId: string;
  onClose: () => void;
}

export function ForensicPanel({ deviceId, onClose }: ForensicPanelProps) {
  const [logs, setLogs] = useState<string>(
    'Esperando inicializaci�n de forense...',
  );

  useEffect(() => {
    const initForensic = async () => {
      setLogs('Extrayendo logs de sistema...');
      try {
        if (window.electronAPI && window.electronAPI.startForensic) {
          const response = await window.electronAPI.startForensic(deviceId);
          if (response && response.success) {
            setLogs('Logs extra�dos exitosamente en: ' + response.path);
          } else {
            setLogs('Error: No se pudo extraer la informaci�n forense.');
          }
        } else {
          setLogs('Error: API forense no disponible.');
        }
      } catch (e: any) {
        setLogs('Error al ejecutar forense: ' + e.message);
      }
    };
    initForensic();
  }, [deviceId]);

  return (
    <div className={styles.panelContainer || 'panelContainer'}>
      <div className={styles.header || 'header'}>
        <h2>An�lisis Forense - {deviceId}</h2>
        <button onClick={onClose} className={styles.closeBtn || 'closeBtn'}>
          Cerrar
        </button>
      </div>
      <div className={styles.content || 'content'}>
        <pre className={styles.logOutput || 'logOutput'}>{logs}</pre>
      </div>
    </div>
  );
}
