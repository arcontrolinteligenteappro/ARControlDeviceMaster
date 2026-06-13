import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TIPOS ---
// Replicar la interfaz del backend para consistencia
interface MonitoredDevice {
  id: string;
  type: string;
  model: string;
  brand: string;
  android: string;
  root: boolean;
  knox: string;
  mdm: string;
  connection: 'USB' | 'WiFi';
  // ... más propiedades de telemetría ...
}

// --- COMPONENTES (sin cambios, se mantienen igual) ---

const ACTION_CATEGORIES = {
  CONTROL: [
    'Remote Control',
    'Fullscreen',
    'Mirror Display',
    'Audio Stream',
    'Screen Off Mode',
  ],
  ADB: [
    'Shell',
    'Wireless ADB',
    'Install APK',
    'Uninstall APK',
    'Extract APK',
    'Reboot',
  ],
  FILES: [
    'Root Explorer',
    'File Manager',
    'ADB Pull',
    'ADB Push',
    'Permissions',
  ],
  FORENSICS: [
    'SQLite Recovery',
    'Freelist Parsing',
    'File Carving',
    'WhatsApp Parser',
    'Logcat Forensics',
  ],
  ADVANCED: [
    'Root Shell',
    'Download Mode',
    'Recovery Mode',
    'Fastboot',
    'EDL',
    'BROM',
  ],
};

const SplashScreen = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 1.5 } }}
    className="fixed inset-0 bg-[#08101E] flex flex-col justify-center items-center z-50 font-mono"
  >
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.5, duration: 1 } }}
    >
      <h1 className="text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        AR CONTROL
      </h1>
      <p className="text-lg text-cyan-600 tracking-[0.3em]">DEVICE MASTER</p>
    </motion.div>

    <div className="absolute bottom-10 w-full text-center text-xs text-gray-500 space-y-1">
      <AnimatePresence>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1.5 } }}
        >
          INITIALIZING SYSTEM...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 2.2 } }}
        >
          ADB ENGINE LOADING...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 2.9 } }}
        >
          AI CORE STARTING...
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 3.6 } }}
        >
          TRANSPORT LAYER ONLINE
        </motion.p>
        <motion.p
          initial={{ opacity: 0, color: '#00E5FF' }}
          animate={{ opacity: 1, transition: { delay: 4.5 } }}
          className="font-bold"
        >
          SYSTEM INITIALIZED
        </motion.p>
      </AnimatePresence>
    </div>
  </motion.div>
);

const EmptyState = () => (
  <div className="flex-1 flex flex-col justify-center items-center text-center">
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl font-bold text-gray-400">NO DEVICES CONNECTED</h2>
      <p className="text-gray-500 mt-2">
        Waiting for Android Device. Auto Discovery Enabled.
      </p>
    </motion.div>
    <div className="mt-8 flex gap-4">
      <button className="bg-cyan-950/40 border border-cyan-700 text-cyan-400 px-6 py-3 text-xs uppercase tracking-widest hover:bg-cyan-900/60 font-bold">
        Scan Network
      </button>
      <button className="bg-gray-800 border border-gray-700 text-gray-400 px-6 py-3 text-xs uppercase tracking-widest hover:bg-gray-700">
        Connect TCP/IP
      </button>
    </div>
  </div>
);

const ActionPopover = ({ actions, onSelect, category, deviceConnection }) => {
  const isAdv = category === 'ADVANCED';
  const isDisabled = isAdv && deviceConnection !== 'USB';

  if (isDisabled) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-full mb-2 w-48 bg-gray-950 border border-gray-700 rounded-md shadow-lg z-10"
    >
      {actions.map((action) => (
        <div
          key={action}
          onClick={() => onSelect(action)}
          className="px-3 py-2 text-sm text-gray-300 hover:bg-cyan-900/50 cursor-pointer first:rounded-t-md last:rounded-b-md"
        >
          {action}
        </div>
      ))}
    </motion.div>
  );
};

const DeviceCard = ({ device, isSelected, onSelect, onAction }) => {
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const handleCategoryClick = (category: string) => {
    if (category === 'ADVANCED' && device.connection !== 'USB') {
      onAction(
        `Safety Check: ADVANCED functions require USB connection for device ${device.id}.`,
        'error',
      );
      return;
    }
    setActivePopover(activePopover === category ? null : category);
  };

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-4 cursor-pointer border-2 transition-all relative rounded-lg flex flex-col justify-between ${
        isSelected
          ? 'bg-blue-900/30 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.25)]'
          : 'bg-gray-950/50 border-gray-800 hover:border-gray-700'
      }`}
    >
      <div onClick={onSelect}>
        {isSelected && (
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 rounded-l-lg"></div>
        )}

        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="font-bold text-lg text-gray-200">{device.id}</span>
            <span className="text-xs text-gray-500 ml-2">{device.type}</span>
          </div>
          <span
            className={`text-xs px-2 py-1 rounded ${device.connection === 'USB' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}
          >
            {device.connection}
          </span>
        </div>

        <div className="text-xs text-gray-400 space-y-1 mb-4 text-left">
          <p>
            {device.brand} {device.model} (Android {device.android})
          </p>
          <p>
            Root:{' '}
            <span className={device.root ? 'text-green-400' : 'text-red-400'}>
              {device.root ? 'Yes' : 'No'}
            </span>{' '}
            | Knox:{' '}
            <span
              className={
                device.knox === '0x0' ? 'text-green-400' : 'text-red-400'
              }
            >
              {device.knox}
            </span>{' '}
            | MDM:{' '}
            <span
              className={
                device.mdm !== 'None' ? 'text-yellow-400' : 'text-gray-500'
              }
            >
              {device.mdm}
            </span>
          </p>
          {/* Telemetry data would be updated via a separate, more frequent event */}
          <div className="pt-2 flex gap-4 opacity-70">
            <span>CPU: --%</span>
            <span>RAM: --%</span>
            <span>Temp: --°C</span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700/50 pt-3 flex justify-around gap-1 relative">
        {Object.keys(ACTION_CATEGORIES).map((cat) => (
          <div key={cat} className="relative">
            <button
              onClick={() => handleCategoryClick(cat)}
              className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded w-full ${
                activePopover === cat
                  ? 'bg-cyan-800 text-white'
                  : 'hover:bg-gray-700'
              } ${cat === 'ADVANCED' && device.connection !== 'USB' ? 'text-gray-600 cursor-not-allowed' : 'text-gray-300'}`}
            >
              {cat}
            </button>
            <AnimatePresence>
              {activePopover === cat && (
                <ActionPopover
                  actions={ACTION_CATEGORIES[cat]}
                  category={cat}
                  deviceConnection={device.connection}
                  onSelect={(action) => {
                    onAction(`[${device.id}] -> ${cat} -> ${action}`);
                    setActivePopover(null);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const ActiveControlGrid = ({ devices, selectedIds, onSelect, onAction }) => (
  <div className="w-full h-full">
    <h2 className="text-sm font-bold text-gray-400 tracking-widest mb-4">
      ACTIVE CONTROL GRID
    </h2>
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4"
    >
      <AnimatePresence>
        {devices.map((dev) => (
          <DeviceCard
            key={dev.id}
            device={dev}
            isSelected={selectedIds.includes(dev.id)}
            onSelect={() => onSelect(dev.id)}
            onAction={onAction}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  </div>
);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [devices, setDevices] = useState<MonitoredDevice[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] AR Control Device Master v5.0 initialized.',
  ]);

  useEffect(() => {
    const splashTimer = setTimeout(() => setIsLoading(false), 5500);

    // 1. Obtener la lista inicial de dispositivos
    window.api.getInitialDevices().then((initialDevices) => {
      if (initialDevices.length > 0) {
        addLog(
          `[SYSTEM] Found ${initialDevices.length} pre-connected devices.`,
        );
        setDevices(initialDevices);
      }
    });

    // 2. Suscribirse a actualizaciones en tiempo real
    const cleanup = window.api.onDevicesUpdated((updatedDevices) => {
      addLog(`[SYSTEM] Device list updated. Total: ${updatedDevices.length}`);
      setDevices(updatedDevices);
    });

    return () => {
      clearTimeout(splashTimer);
      cleanup(); // Limpiar el listener al desmontar
    };
  }, []);

  const addLog = (msg: string, type: 'info' | 'error' = 'info') => {
    const prefix =
      type === 'error' ? '[ERROR]' : `[${new Date().toLocaleTimeString()}]`;
    setLogs((prev) => [`${prefix} ${msg}`, ...prev].slice(0, 100));
  };

  const handleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSelection = prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id];
      addLog(`[SELECTION] Toggled node ${id}. Active: ${newSelection.length}`);
      return newSelection;
    });
  };

  return (
    <div className="w-screen h-screen bg-[#08101E] text-white font-mono flex flex-col p-4 overflow-hidden">
      <AnimatePresence>{isLoading && <SplashScreen />}</AnimatePresence>

      {!isLoading && (
        <>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="border-b border-cyan-900/50 pb-4 mb-6 flex justify-between items-center flex-shrink-0"
          >
            <div>
              <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                AR CONTROL
              </h1>
              <span className="text-[10px] text-cyan-600 tracking-[0.2em]">
                DEVICE MASTER // ENTERPRISE SUITE
              </span>
            </div>
            <div className="bg-cyan-950/30 border border-cyan-800 px-4 py-2 text-xs">
              NODOS ACTIVOS:{' '}
              <span className="text-cyan-400 font-bold">
                {selectedIds.length}
              </span>{' '}
              / {devices.length}
            </div>
          </motion.div>

          <div className="flex gap-6 h-full overflow-hidden">
            <div className="flex-1 flex flex-col overflow-y-auto">
              <AnimatePresence mode="wait">
                {devices.length > 0 ? (
                  <motion.div
                    key="grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ActiveControlGrid
                      devices={devices}
                      selectedIds={selectedIds}
                      onSelect={handleSelection}
                      onAction={addLog}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <EmptyState />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="w-1/3 max-w-sm bg-gray-950/70 border border-gray-800 flex flex-col rounded-lg"
            >
              <div className="bg-gray-900 border-b border-gray-800 p-2 text-[10px] text-gray-500 tracking-widest rounded-t-lg">
                IPC_TELEMETRY_TERMINAL
              </div>
              <div className="p-4 flex-1 overflow-y-auto text-[10px] text-cyan-500/80 flex flex-col-reverse gap-1">
                <AnimatePresence initial={false}>
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`border-b border-gray-900/50 pb-1 ${log.startsWith('[ERROR]') ? 'text-red-400' : ''}`}
                    >
                      {log}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
