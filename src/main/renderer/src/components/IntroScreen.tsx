// src/renderer/src/components/IntroScreen.tsx
import React from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000000', // Fondo negro absoluto para no destellar
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <video
        src="./intro.mp4" /* Cambie "intro.mp4" por el nombre exacto de su archivo */
        autoPlay
        muted /* Recomendado: arrancar muteado evita bloqueos del navegador interno */
        playsInline
        onEnded={onComplete} /* El disparador automático al terminar el video */
        style={{
          width: '100%',
          height: '100%',
          objectFit:
            'cover' /* Ajusta el video para cubrir toda la pantalla sin deformarse */,
        }}
      />

      {/* Botón táctico de emergencia para saltar la intro manualmente si el usuario lo desea */}
      <button
        onClick={onComplete}
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid #00f2fe',
          color: '#00f2fe',
          fontFamily: 'monospace',
          padding: '5px 15px',
          cursor: 'pointer',
          zIndex: 10,
        }}
      >
        Omitir Secuencia &gt;&gt;
      </button>
    </div>
  );
};
