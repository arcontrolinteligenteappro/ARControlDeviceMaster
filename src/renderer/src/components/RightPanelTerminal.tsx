// src/renderer/src/components/RightPanelTerminal.tsx
import React, { useEffect, useRef, useState } from 'react';

interface LogEntry {
  type: 'ERROR' | 'WARN' | 'SUCCESS' | 'CMD' | 'INFO';
  message: string;
}

const RightPanelTerminal: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    scrollToBottom();
  }, [logs]);

  useEffect(() => {
    // Mock data for demonstration until IPC is fully wired
    setLogs([
        { type: 'CMD', message: 'Starting AR Control Device Master v9.0...' },
        { type: 'SUCCESS', message: 'IPC Master Router Initialized.' },
        { type: 'INFO', message: 'Listening for device connections on ADB server.' },
        { type: 'WARN', message: 'High memory usage detected on worker thread #2.' },
    ]);

    const handleLog = (log: LogEntry) => {
        setLogs((prevLogs) => [...prevLogs, log]);
    };
    
    // @ts-ignore - Assuming .on method exists on window.api for stream listeners
    window.api.on('terminal:stdout', handleLog);

    return () => {
      // @ts-ignore
      window.api.off('terminal:stdout', handleLog);
    };
  }, []);

  const getTextColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'ERROR':
        return 'text-red-500'; // Red for errors
      case 'WARN':
        return 'text-yellow-400'; // Yellow for warnings
      case 'SUCCESS':
        return 'text-[#00FF41]'; // Terminal green for success
      case 'CMD':
        return 'text-cyan-400'; // Cyan for commands/user-input
      default:
        return 'text-gray-300'; // Default color for info
    }
  };

  return (
    <div
      className="h-full p-4 font-mono text-[10px]"
      style={{ backgroundColor: '#010204' }}
    >
      <div className="overflow-y-auto h-full">
        {logs.map((log, index) => (
          <p key={index} className={`whitespace-pre-wrap ${getTextColor(log.type)}`}>
            <span className='text-gray-500 mr-2'>{`>_`}</span>{log.message}
          </p>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default RightPanelTerminal;
