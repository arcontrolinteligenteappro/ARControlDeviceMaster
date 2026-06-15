import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [override, setOverride] = useState(false);

  useEffect(() => {
    // Temporizador de auto-skip (8 segundos)
    const timer = setTimeout(() => {
      if (!override) onFinish();
    }, 8000);
    return () => clearTimeout(timer);
  }, [override, onFinish]);

  const handleOverride = () => {
    setOverride(true);
    onFinish();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#02050A] flex flex-col justify-center items-center font-mono overflow-hidden">
      {/* En el .exe aquí iría el <video autoplay src={animacionWebm} /> */}
      <div className="absolute inset-0 bg-[#02050A]/90 z-10"></div>{' '}
      {/* Overlay */}
      {/* Lógica de Animación basada en tus escenas (Simulación con texto neón) */}
      <div className="z-20 text-center relative">
        {/* AR LOGO ASSEMBLING (Scene 3) */}
        <div className="text-6xl font-black tracking-widest text-cyan-400 mb-2 animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.5)]">
          AR CONTROL
        </div>
        <div className="text-[10px] text-cyan-600 tracking-[0.4em] mb-12 relative top-[-10px]">
          DEVICE MASTER // ENTERPRISE SUITE
        </div>

        {/* HUD animations & System Status (Scene 4) */}
        <div className="text-[10px] text-gray-500 flex flex-col gap-1 items-start border border-gray-800 p-4 bg-gray-950/50">
          <p className="text-cyan-400 animate-pulse">
            [&gt;] INITIALIZING SYSTEM...
          </p>
          <p className="text-cyan-400">
            [&gt;] TRANSPORT LAYER ONLINE (USB/TCP)
          </p>
          <p className="text-purple-400">[&gt;] AI CORE STARTING...</p>
          <p className="text-green-400">[&gt;] TACTICAL COMMAND CENTER READY</p>
        </div>
      </div>
      {/* Botón OVERRIDE ortogonal (Corner inferior derecho) */}
      <button
        onClick={handleOverride}
        className="absolute bottom-10 right-10 z-30 bg-cyan-950/40 border border-cyan-700 text-cyan-400 px-6 py-2 text-xs uppercase font-bold tracking-widest hover:bg-cyan-900 transition-all shadow-[0_0_10px_rgba(0,240,255,0.3)]"
      >
        [ OVERRIDE ]
      </button>
      {/* Background Effect: Circuit board patterns & Particles */}
      <div className="absolute inset-0 opacity-10 bg-[url('assets/circuits.svg')] bg-cover"></div>
    </div>
  );
}
