// src/renderer/src/components/DisconnectedState.tsx
import React from 'react';
import ManualConnection from './ManualConnection'; // Componente a crear

const DisconnectedState: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl font-bold text-cyan-400 mb-4">
        NO DEVICES DETECTED
      </h1>
      <p className="text-gray-400 mb-8">
        Connect a device via USB or use manual IP connection.
      </p>
      <div className="w-1/3">
        <ManualConnection />
      </div>
      {/* Aquí irían los medidores del PC host */}
    </div>
  );
};

export default DisconnectedState;
