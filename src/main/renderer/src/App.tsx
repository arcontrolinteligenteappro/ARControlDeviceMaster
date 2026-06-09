import React, { useState, useEffect } from 'react';

export default function App() {
    // Mock de dispositivos (Reemplazar por llamada real a window.api.control.getDevices)
    const [devices, setDevices] = useState([{ id: 'NEXUS-01' }, { id: 'SAMSUNG-02' }]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [logs, setLogs] = useState<string[]>(['[SYSTEM] AR Control Device Master v5.0 inicializado.']);

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    // KEYMAPPING Y MULTICONTROL DE BAJA LATENCIA (Fase 2.5)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedIds.length === 0) return;

            let inputCmd = '';
            if (e.key.toLowerCase() === 'w') inputCmd = 'input tap 500 300';
            if (e.key.toLowerCase() === 'a') inputCmd = 'input tap 300 500';
            if (e.key.toLowerCase() === 's') inputCmd = 'input tap 500 700';
            if (e.key.toLowerCase() === 'd') inputCmd = 'input tap 700 500';

            if (inputCmd) {
                // Llama al túnel abierto (Zero-Latency)
                (window as any).api.control.multiStream(selectedIds, inputCmd);
                addLog(`[STREAM] Key ${e.key.toUpperCase()} -> ${inputCmd}`);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIds]);

    const handlePowerMacro = async () => {
        if (selectedIds.length === 0) return addLog('[ERROR] Seleccione un nodo.');
        addLog(`[BROADCAST] Despachando Keyevent 26 a ${selectedIds.length} nodos...`);
        // Llama al macro pesado (Promise.all)
        await (window as any).api.control.multiBroadcast(selectedIds, 'input keyevent 26');
    };

    const toggleSelection = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="w-screen h-screen bg-[#02050A] text-white font-mono flex flex-col p-4">
            
            {/* HEADER ORTOGONAL */}
            <div className="border-b border-cyan-900/50 pb-4 mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        AR CONTROL
                    </h1>
                    <span className="text-[10px] text-cyan-600 tracking-[0.2em]">DEVICE MASTER // ENTERPRISE SUITE</span>
                </div>
                <div className="bg-cyan-950/30 border border-cyan-800 px-4 py-2 text-xs">
                    NODOS ACTIVOS: <span className="text-cyan-400 font-bold">{selectedIds.length}</span>
                </div>
            </div>

            <div className="flex gap-6 h-full overflow-hidden">
                {/* TACTICAL GRID */}
                <div className="w-2/3 flex flex-col">
                    <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-4">TACTICAL MULTI-CONTROL GRID</h2>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {devices.map(dev => (
                            <div 
                                key={dev.id}
                                onClick={() => toggleSelection(dev.id)}
                                className={`p-4 cursor-pointer border transition-all relative ${
                                    selectedIds.includes(dev.id) 
                                    ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                                    : 'bg-gray-950 border-gray-800 hover:border-gray-700'
                                }`}
                            >
                                {selectedIds.includes(dev.id) && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                                <span className="text-xs font-bold text-gray-300">{dev.id}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto border-t border-gray-800 pt-4 flex gap-4">
                        <button 
                            onClick={handlePowerMacro}
                            className="bg-cyan-950/40 border border-cyan-700 text-cyan-400 px-6 py-3 text-xs uppercase tracking-widest hover:bg-cyan-900/60 font-bold"
                        >
                            Macro: Power ALL
                        </button>
                    </div>
                </div>

                {/* LOGS TERMINAL */}
                <div className="w-1/3 bg-gray-950 border border-gray-800 flex flex-col">
                    <div className="bg-gray-900 border-b border-gray-800 p-2 text-[10px] text-gray-500 tracking-widest">
                        IPC_TELEMETRY_TERMINAL
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto text-[10px] text-cyan-500/80 flex flex-col gap-1">
                        {logs.map((log, i) => (
                            <div key={i} className="border-b border-gray-900/50 pb-1">{log}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}