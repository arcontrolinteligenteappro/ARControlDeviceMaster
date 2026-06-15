import React, { useEffect, useRef } from 'react';
import styles from './CoreMap.module.css';

export const CoreMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Sincronizar la resolución del canvas con el tamaño visual
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Dibujar círculos orbitales
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.2)';
      for (let i = 1; i <= 3; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, i * 80, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Dibujar nodos
      ctx.fillStyle = '#9d4edd';
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * 160;
        const y = centerY + Math.sin(angle) * 160;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.moveTo(x, y);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
      }
    };
    draw();
  }, []);

  return (
    <div className={styles.mapContainer}>
      <canvas ref={canvasRef} className={styles.mapCanvas} />
    </div>
  );
};
