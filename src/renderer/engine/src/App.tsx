import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import ActiveControlGrid from './components/ActiveControlGrid';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [devices, setDevices] = useState([]); // Mock vacío para simular Empty State

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />;

  return (
    <div className="w-screen h-screen bg-[#02050A] text-white font-mono p-4 flex flex-col">
      {devices.length === 0 ? (
        // --- AR CONTROL DEVICE MASTER // EMPTY STATE INTERFACE ---
        <div className="flex-1 flex flex-col justify-center items-center relative overflow-hidden">
          {/* Background: Cyber security command center & animated grid */}
          <div className="absolute inset-0 opacity-5 bg-[url('assets/command_center.svg')] bg-cover"></div>
          <div className="absolute inset-0 bg-grid-pattern animate-grid-drift"></div>

          {/* Center of screen: Large holographic AR logo & Animated AI Core */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-9xl font-black text-cyan-950/40 tracking-tighter mb-4 animate-breathing-glow relative">
              AR
              {/* Rotating scanning radar & Circular pulse effect */}
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-radar-sweep"></div>
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/10 animate-ping"></div>
            </div>

            {/* Main Message & Sub Message */}
            <h1 className="text-2xl font-bold text-gray-500 tracking-widest mb-1">
              NO DEVICES CONNECTED
            </h1>
            <p className="text-[10px] text-gray-700 tracking-widest mb-12">
              Waiting for Android Device // Auto Discovery Enabled
            </p>

            {/* Buttons (Ortogonales) */}
            <div className="grid grid-cols-3 gap-3">
              {[
                'Scan Network',
                'Connect TCP/IP',
                'Manual Connection',
                'ADB Restart',
                'Open Logs',
              ].map((btn) => (
                <button
                  key={btn}
                  className="bg-gray-950 border border-gray-800 text-gray-500 px-4 py-2 text-[10px] uppercase tracking-widest hover:border-cyan-700 hover:text-cyan-400 transition-all hover:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Status Panels (Esquina superior izquierda) */}
          <div className="absolute top-4 left-4 border border-gray-800 bg-gray-950/80 p-3 text-[9px] flex flex-col gap-1 tracking-widest z-20">
            <p>
              ADB Service:{' '}
              <span className="text-green-400 animate-pulse">ONLINE</span>
            </p>
            <p>
              USB Listener: <span className="text-green-400">ACTIVE</span>
            </p>
            <p>
              TCP/IP Discovery: <span className="text-cyan-400">ACTIVE</span>
            </p>
            <p>
              Wireless Scan: <span className="text-purple-400">RUNNING</span>
            </p>
            <p>
              HDMI/DP Detection: <span className="text-gray-600">WAITING</span>
            </p>
          </div>
        </div>
      ) : (
        <ActiveControlGrid devices={devices} />
      )}
    </div>
  );
}
