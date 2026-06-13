// src/renderer/src/components/InitFlow.tsx
import React from 'react';

const InitFlow: React.FC = () => {
  return (
    <div className="w-full h-screen absolute top-0 left-0">
      <video
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
        src="../assets/animacion.mp4" // Asegúrate que la ruta sea correcta
      />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-1/2">
        <p className="text-cyan-400 text-center font-mono">
          INITIALIZING DAEMONS...
        </p>
        <div className="w-full bg-gray-700 h-2 mt-2">
          <div className="bg-cyan-400 h-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default InitFlow;
