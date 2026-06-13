// src/renderer/src/components/ManualDeviceForm.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ManualDeviceForm = () => {
  const { t } = useTranslation();
  const [ip, setIp] = useState('');
  const [port, setPort] = useState('5555');
  const [token, setToken] = useState('');

  const handleConnect = () => {
    // IPC call to the main process to connect to the device manually
    // window.electron.ipcRenderer.send('manual-connect', { ip, port, token });
    console.log(`Connecting to ${ip}:${port} with token ${token}`);
  };

  return (
    <div className="bg-black/80 p-4 border border-cyan-900/50 backdrop-blur-md">
      <h3 className="text-cyan-400 text-lg mb-4">{t('manualConnection')}</h3>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder={t('ipAddress')}
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          className="bg-transparent border-b border-cyan-700 focus:outline-none focus:border-cyan-400"
        />
        <input
          type="text"
          placeholder={t('port')}
          value={port}
          onChange={(e) => setPort(e.target.value)}
          className="bg-transparent border-b border-cyan-700 focus:outline-none focus:border-cyan-400"
        />
        <input
          type="text"
          placeholder={t('authorizationToken')}
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="bg-transparent border-b border-cyan-700 focus:outline-none focus:border-cyan-400"
        />
        <button
          onClick={handleConnect}
          className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-2 px-4 rounded transition-all duration-300"
        >
          {t('connect')}
        </button>
      </div>
    </div>
  );
};

export default ManualDeviceForm;
