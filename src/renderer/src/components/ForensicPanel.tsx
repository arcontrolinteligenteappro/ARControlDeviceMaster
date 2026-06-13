// src/renderer/src/components/ForensicPanel.tsx
import React, { useState, useEffect } from 'react';
import { IpcChannel, IpcEvent } from '../../../main/ipc';
import { Device } from '../../../main/modules/devices/Device';

interface TerminalLine {
  type: 'info' | 'success' | 'warn' | 'error' | 'final';
  message: string;
  timestamp: string;
}

interface ForensicPanelProps {
  devices: Device[];
}

const ForensicPanel: React.FC<ForensicPanelProps> = ({ devices }) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isDumping, setIsDumping] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<TerminalLine[]>([]);

  const connectedDevices = devices.filter((d) => d.state === 'device');

  useEffect(() => {
    const removeListener = window.api.on(
      IpcEvent.FORENSIC_PROGRESS,
      (event, log: TerminalLine) => {
        const newLog = { ...log, timestamp: new Date().toLocaleTimeString() };
        setTerminalOutput((prev) => [...prev, newLog]);
        if (log.type === 'final') {
          setIsDumping(false);
        }
      },
    );

    return () => removeListener();
  }, []);

  useEffect(() => {
    // Si solo hay un dispositivo, pre-seleccionarlo
    if (connectedDevices.length === 1 && !selectedDeviceId) {
      setSelectedDeviceId(connectedDevices[0].id);
    }
  }, [devices]);

  const handleStartDump = () => {
    if (!selectedDeviceId) {
      alert('Please select a device.');
      return;
    }
    setIsDumping(true);
    setTerminalOutput([]); // Limpiar terminal
    window.api.invoke(IpcChannel.START_FORENSIC_DUMP, {
      deviceId: selectedDeviceId,
      dumpType: 'quick', // Hardcoded por ahora
    });
  };

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warn':
        return 'text-amber-400';
      case 'error':
        return 'text-red-500';
      case 'final':
        return 'text-purple-400 font-bold';
      default:
        return 'text-gray-300';
    }
  };

  return (
    <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
      <h2 className="text-xl text-cyan-400 font-bold">Forensic Toolkit</h2>
      <div className="flex items-center gap-4 mt-4">
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
          disabled={isDumping || connectedDevices.length === 0}
          className="bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
        >
          <option value="">
            {connectedDevices.length === 0
              ? 'No devices connected'
              : 'Select a device'}
          </option>
          {connectedDevices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.model || device.id}
            </option>
          ))}
        </select>
        <button
          onClick={handleStartDump}
          disabled={isDumping || !selectedDeviceId}
          className="px-4 py-2 font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isDumping ? 'Dumping in Progress...' : 'Start Quick Dump'}
        </button>
      </div>

      <div className="mt-4 p-3 h-64 font-mono text-sm bg-black rounded-md overflow-y-auto border border-gray-600">
        {terminalOutput.length === 0 && (
          <p className="text-gray-500">[Terminal output will appear here]</p>
        )}
        {terminalOutput.map((line, index) => (
          <div
            key={index}
            className={`whitespace-pre-wrap ${getLineColor(line.type)}`}
          >
            <span className="text-gray-500 mr-2">{line.timestamp}</span>
            <span>{line.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForensicPanel;
