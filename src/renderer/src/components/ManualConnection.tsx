// src/renderer/src/components/ManualConnection.tsx
import React, { useState } from 'react';
import { IpcChannel } from '../../../main/ipc';

const ManualConnection: React.FC = () => {
  const [ip, setIp] = useState('');

  const handleConnect = () => {
    if (ip) {
      window.api.invoke(IpcChannel.MANUAL_CONNECT, { ip });
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
      <label
        htmlFor="ip-input"
        className="block text-sm font-medium text-cyan-400"
      >
        Manual TCP/IP Injection
      </label>
      <div className="mt-2 flex rounded-md shadow-sm">
        <input
          type="text"
          name="ip-input"
          id="ip-input"
          className="flex-1 block w-full rounded-none rounded-l-md bg-gray-900 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          placeholder="192.168.1.100"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <button
          type="button"
          onClick={handleConnect}
          className="inline-flex items-center px-3 py-2 border border-l-0 border-cyan-500 text-sm font-medium rounded-r-md text-cyan-400 bg-transparent hover:bg-cyan-500 hover:text-black"
        >
          Connect
        </button>
      </div>
    </div>
  );
};

export default ManualConnection;
