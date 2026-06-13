import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useSync } from '../hooks/useSync';
import AdbRebootButton from './buttons/AdbRebootButton';
import { IpcChannel } from '../../../ipc'; // Importar los canales de IPC
import { ScrcpyOptions } from '../../../../main/modules/scrcpy/ScrcpyManager';

// Esta interfaz ahora coincide con la del backend
interface Device {
  id: string;
  state: 'device' | 'offline' | 'unauthorized';
  model?: string;
  isRooted?: boolean;
}

const DeviceList: React.FC = () => {
  const { t } = useTranslation();
  const { devices } = useSync();

  const handleStartScrcpy = async (deviceId: string) => {
    const options: ScrcpyOptions = { deviceId };
    try {
      // Usamos invoke para una comunicación asíncrona y robusta
      const result = await window.electron.ipcRenderer.invoke(
        IpcChannel.START_SCRCPY,
        options,
      );
      if (!result) {
        console.warn(`Scrcpy session for ${deviceId} might not have started.`);
      }
    } catch (error) {
      console.error('Failed to start scrcpy session:', error);
    }
  };

  const handleStartGaming = (deviceId: string) => {
    // Suponiendo que este canal se definirá en el futuro
    window.electron.ipcRenderer.invoke('START_GAMING_SESSION', { deviceId });
  };

  if (!devices || devices.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400">{t('No devices connected')}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">
        {t('Connected Devices')}
      </h2>
      {devices.map((device: Device, index: number) => (
        <motion.div
          key={device.id}
          className="bg-gray-800 bg-opacity-60 p-4 rounded-lg shadow-lg flex items-center justify-between"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div>
            <p className="font-bold text-white">{device.model || device.id}</p>
            <div className="flex items-center space-x-2">
              <p
                className={`text-sm ${device.state === 'device' ? 'text-green-400' : 'text-red-400'}`}
              >
                {t(device.state)}
              </p>
              {device.isRooted && (
                <span className="text-xs text-yellow-400 font-bold">
                  Rooted
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStartScrcpy(device.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 disabled:opacity-50"
              disabled={device.state !== 'device'}
            >
              {t('Mirror Screen')}
            </button>
            <button
              onClick={() => handleStartGaming(device.id)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300 disabled:opacity-50"
              disabled={device.state !== 'device'}
            >
              {t('Gaming Mode')}
            </button>
            <AdbRebootButton
              deviceId={device.id}
              isOnline={device.state === 'device'}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DeviceList;
