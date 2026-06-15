import React, { useRef, useEffect, useState } from 'react';
import JMuxer from 'jmuxer';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  deviceId: string;
  isStreaming: boolean;
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  deviceId,
  isStreaming,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [fps, setFps] = useState<number>(0);
  const [bitrate, setBitrate] = useState<string>('0.0 Mbps');

  useEffect(() => {
    if (!isStreaming || !videoRef.current) return;

    let frameCount = 0;
    let lastTime = performance.now();

    window.api.scrcpyH264(deviceId);

    const handleData = (_: any, data: any) => {
      if (data.id !== deviceId) return;

      const buffer = Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0));
      new JMuxer({
        node: videoRef.current!,
        mode: 'video',
        flushingTime: 0,
        fps: 60,
        debug: false,
      }).feed({ video: buffer });

      frameCount++;
      const time = performance.now();
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        setBitrate(
          ((buffer.length * frameCount * 8) / 1000000).toFixed(1) + ' Mbps',
        );
        frameCount = 0;
        lastTime = time;
      }
    };

    window.api.onH264(handleData);

    return () => {
      new JMuxer({
        node: videoRef.current!,
        mode: 'video',
        flushingTime: 0,
        fps: 60,
        debug: false,
      }).destroy();
    };
  }, [isStreaming, deviceId]);

  return (
    <div className={styles.container}>
      <div className={styles.statusBar}>
        <div className={styles.statusInfo}>
          <span>
            DISPOSITIVO: <strong>{deviceId}</strong>
          </span>
          <span>
            FPS: <strong>{fps}</strong>
          </span>
          <span>
            ANCHO DE BANDA: <strong>{bitrate}</strong>
          </span>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          Desconectar Espejo
        </button>
      </div>

      <div className={styles.videoArea}>
        <video ref={videoRef} autoPlay muted className={styles.videoElement} />
      </div>
    </div>
  );
};
