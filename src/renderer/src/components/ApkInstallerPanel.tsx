// src/renderer/src/components/ApkInstallerPanel.tsx
import React, { useState } from 'react';
import { IpcChannel, IpcEvent } from '../../../main/ipc';
import { Device } from '../../../main/modules/devices/Device';

interface ApkInstallerPanelProps {
  devices: Device[];
}

const ApkInstallerPanel: React.FC<ApkInstallerPanelProps> = ({ devices }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [apkPath, setApkPath] = useState<string>('');
  const [isInstalling, setIsInstalling] = useState(false);

  const availableDevices = devices.filter((d) => d.state === 'device');

  const handleSelectApk = async () => {
    const path = await window.api.invoke('open-file-dialog-for-apk');
    if (path) {
      setApkPath(path);
    }
  };

  const handleInstall = async () => {
    if (!selectedDevice || !apkPath) {
      window.api.send(
        IpcEvent.TERMINAL_OUTPUT,
        'Error: Please select a device and an APK file.',
      );
      return;
    }

    setIsInstalling(true);
    const result = await window.api.invoke(IpcChannel.INSTALL_APK, {
      deviceId: selectedDevice,
      apkPath,
    });

    if (!result.success) {
      // The error message is already sent via TERMINAL_OUTPUT from the main process
      console.error('APK installation failed:', result.error);
    }

    // The notification system will show success or failure
    setIsInstalling(false);
    setApkPath(''); // Reset path after attempt
  };

  return (
    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
      <h3 className="text-xl text-cyan-400 font-bold">APK INSTALLER</h3>
      <p className="text-sm text-gray-400 mb-4">
        Install an Android application package (.apk) to a connected device.
      </p>

      <div className="flex items-stretch space-x-4">
        {/* Botón y path del APK */}
        <div className="flex-grow flex items-center border border-gray-600 rounded bg-gray-800">
          <button
            onClick={handleSelectApk}
            disabled={isInstalling}
            className="px-4 py-1.5 bg-cyan-700 hover:bg-cyan-600 rounded-l-md font-semibold h-full"
          >
            Select APK
          </button>
          <p className="px-3 text-sm text-gray-300 truncate" title={apkPath}>
            {apkPath ? apkPath.split(/[\\/]/).pop() : 'No file selected'}
          </p>
        </div>

        {/* Selector de Dispositivo */}
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          disabled={isInstalling}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white"
        >
          <option value="">-- Select Device --</option>
          {availableDevices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.model || device.id}
            </option>
          ))}
        </select>

        {/* Botón de Instalar */}
        <button
          onClick={handleInstall}
          disabled={!selectedDevice || !apkPath || isInstalling}
          className="px-6 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isInstalling ? 'Installing...' : 'Install'}
        </button>
      </div>
    </div>
  );
};

export default ApkInstallerPanel;
