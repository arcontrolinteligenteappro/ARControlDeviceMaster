import React from 'react';
import DeviceCard from './DeviceCard';
import bg from '../assets/bg_conectados.png';

export default function DevicesGrid({ devices }: any) {
  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className="min-h-screen bg-cover bg-center text-cyan-400 p-4"
    >
      <h1 className="mb-4 text-xl tracking-widest">AR CONTROL GRID</h1>

      <div className="grid grid-cols-4 gap-4">
        {devices.map((d: any) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}
