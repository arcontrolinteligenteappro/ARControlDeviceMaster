// src/renderer/src/components/ConnectedState.tsx
import React, { useState, useEffect } from 'react';
import { IpcChannel, IpcEvent } from '../../../main/ipc';
import { Device } from '../../../main/modules/devices/Device';
import ForensicPanel from './ForensicPanel';
import KeymapperPanel from './KeymapperPanel';
import ApkInstallerPanel from './ApkInstallerPanel'; // Importar el nuevo panel

// ... (El componente DeviceCard no cambia) ...
interface DeviceCardProps {
  device: Device;
  onViewDevice: (deviceId: string) => void;
  onRebootDevice: (deviceId: string) => void;
  isSessionActive: boolean;
}

const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onViewDevice,
  onRebootDevice,
  isSessionActive,
}) => {
  const isConnectable = device.state === 'device';

  const handleRebootClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      window.confirm(
        `Are you sure you want to reboot device ${device.model || device.id}?`,
      )
    ) {
      onRebootDevice(device.id);
    }
  };

  return (
    <div
      onClick={() => isConnectable && onViewDevice(device.id)}
      className={`relative border-2 p-3 rounded-lg text-left transition-all duration-200 group
                  ${
                    !isConnectable
                      ? 'border-amber-500/50 bg-gray-800/20 cursor-not-allowed'
                      : isSessionActive
                        ? 'border-purple-600 bg-purple-900/30 ring-2 ring-purple-500 cursor-pointer'
                        : 'border-cyan-500 hover:bg-cyan-900/50 hover:border-cyan-400 cursor-pointer'
                  }`}
    >
      {isConnectable && (
        <button
          onClick={handleRebootClick}
          title="Reboot Device"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-700/50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-800/70 transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v5a1 1 0 102 0V7z"
              clipRule="evenodd"
            />
            <path d="M10.707 3.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0z" />
          </svg>
        </button>
      )}

      <div className="pr-8">
        <p className="text-white font-bold truncate">
          {device.model || device.id}
        </p>
        <p
          className={`text-sm ${isConnectable ? 'text-green-400' : 'text-amber-400'}`}
        >
          {device.state}
        </p>
        {device.isRooted && (
          <p className="text-xs text-red-400 font-bold">ROOT</p>
        )}
      </div>

      {isSessionActive && (
        <div className="mt-2 flex items-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          <p className="text-xs text-purple-300 ml-2">Viewing...</p>
        </div>
      )}
    </div>
  );
};

const ConnectedState: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [activeSessions, setActiveSessions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchInitialData = async () => {
      const initialDevices = await window.api.invoke(IpcChannel.LIST_DEVICES);
      setDevices(initialDevices);
    };
    fetchInitialData();

    const removeDevicesListener = window.api.on(
      IpcEvent.DEVICES_LIST_UPDATED,
      (event, deviceList: Device[]) => {
        setDevices(deviceList);
      },
    );

    const removeSessionStartListener = window.api.on(
      IpcEvent.SCRCPY_SESSION_STARTED,
      (event, { deviceId }: { deviceId: string }) => {
        setActiveSessions((prev) => new Set(prev).add(deviceId));
      },
    );

    const removeSessionEndListener = window.api.on(
      IpcEvent.SCRCPY_SESSION_ENDED,
      (event, { deviceId }: { deviceId: string }) => {
        setActiveSessions((prev) => {
          const newSessions = new Set(prev);
          newSessions.delete(deviceId);
          return newSessions;
        });
      },
    );

    return () => {
      removeDevicesListener();
      removeSessionStartListener();
      removeSessionEndListener();
    };
  }, []);

  const handleViewDevice = (deviceId: string) => {
    window.api.invoke(IpcChannel.START_SCRCPY, { deviceId });
  };

  const handleRebootDevice = (deviceId: string) => {
    window.api.invoke(IpcChannel.REBOOT_DEVICE, { deviceId });
  };

  return (
    <div className="w-full h-screen p-4 overflow-y-auto">
      <div>
        <h1 className="text-2xl text-purple-400 font-bold">
          ACTIVE CONTROL GRID
        </h1>
        <h2 className="text-md text-cyan-500">
          Select a device for screen mirroring or other actions.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 mt-4">
          {devices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onViewDevice={handleViewDevice}
              onRebootDevice={handleRebootDevice}
              isSessionActive={activeSessions.has(device.id)}
            />
          ))}
          {devices.length === 0 && (
            <div className="text-gray-500 col-span-full text-center mt-10">
              <p>Connecting to ADB service...</p>
            </div>
          )}
        </div>
      </div>

      {/* Paneles de Funcionalidades */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ApkInstallerPanel devices={devices} />
          <KeymapperPanel devices={devices} activeSessions={activeSessions} />
        </div>
        <ForensicPanel devices={devices} />
      </div>
    </div>
  );
};

export default ConnectedState;
