import React from 'react';
import bg from '../assets/bg_sindispositivos.png';

export default function NoDevices() {
  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="h-screen bg-cover bg-center flex flex-col items-center justify-center text-cyan-400"
    >
      <div className="relative w-52 h-52 border border-cyan-400">
        <div className="absolute inset-0 animate-ping border border-cyan-400"></div>
        <div className="absolute inset-6 border border-purple-500"></div>
      </div>

      <p className="mt-6 text-lg tracking-widest">ESCANEANDO DISPOSITIVOS...</p>
    </div>
  );
}
