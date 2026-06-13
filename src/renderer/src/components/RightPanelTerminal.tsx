// src/renderer/src/components/RightPanelTerminal.tsx
import React, { useEffect, useRef, useState } from 'react';
import { IpcEvent } from '../../../main/ipc'; // Importar el enum de eventos

interface LogEntry {
  type: 'ERROR' | 'WARN' | 'SUCCESS' | 'CMD' | 'INFO';
  message: string;
}

// Función para inferir el tipo de log a partir del mensaje
const parseLogMessage = (message: string): LogEntry => {
  const lowerCaseMessage = message.toLowerCase();
  if (lowerCaseMessage.includes('error')) {
    return { type: 'ERROR', message };
  }
  if (
    lowerCaseMessage.includes('warn') ||
    lowerCaseMessage.includes('warning')
  ) {
    return { type: 'WARN', message };
  }
  if (lowerCaseMessage.includes('success')) {
    return { type: 'SUCCESS', message };
  }
  if (lowerCaseMessage.startsWith('>')) {
    // Asumimos que los comandos empiezan con >
    return { type: 'CMD', message };
  }
  return { type: 'INFO', message };
};

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
    // Inicializamos con un mensaje de bienvenida
    setLogs([parseLogMessage('Welcome to AR-Control. Terminal is ready.')]);

    // El listener ahora es robusto y tipado
    const handleLog = (_event: any, message: string) => {
      const newLog = parseLogMessage(message);
      setLogs((prevLogs) => [...prevLogs, newLog]);
    };

    // Usamos la API estándar de Electron y el canal correcto
    window.electron.ipcRenderer.on(IpcEvent.TERMINAL_OUTPUT, handleLog);

    return () => {
      // Limpiamos el listener al desmontar el componente
      window.electron.ipcRenderer.removeListener(
        IpcEvent.TERMINAL_OUTPUT,
        handleLog,
      );
    };
  }, []);

  const getTextColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'ERROR':
        return 'text-red-500';
      case 'WARN':
        return 'text-yellow-400';
      case 'SUCCESS':
        return 'text-green-400';
      case 'CMD':
        return 'text-cyan-400';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="h-full p-3 font-mono text-xs bg-gray-900 text-white">
      <div className="overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {logs.map((log, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap ${getTextColor(log.type)}`}
          >
            <span className="text-gray-600 mr-2 select-none">#</span>
            <span>{log.message}</span>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
};

export default RightPanelTerminal;
