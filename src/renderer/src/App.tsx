import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AdbDevice } from '@shared/types/AdbDevice';
import { IpcChannel } from '@ipc/index';
import { Button } from '@ui/button';
import Spinner from '@ui/Spinner'; // Import the new Spinner component

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [devices, setDevices] = useState<AdbDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<AdbDevice | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleDeviceSelection = (device: AdbDevice) => {
    setSelectedDevice(device);
    window.electron.ipcRenderer.send(IpcChannel.START_SCREEN_MIRROR, device.id);
  };

  const searchForDevices = async () => {
    setIsLoading(true);
    try {
      const foundDevices = await window.electron.ipcRenderer.invoke(
        IpcChannel.LIST_DEVICES,
      );
      setDevices(foundDevices);
    } catch (error) {
      console.error('Error searching for devices:', error);
      // Optionally, set an error state and display a message to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchForDevices();
  }, []);

  return (
    <div className="container">
      <div className="language-switcher">
        <Button onClick={() => changeLanguage('en')}>English</Button>
        <Button onClick={() => changeLanguage('es')}>Español</Button>
      </div>

      <h1>{t('app_title')}</h1>

      {isLoading ? (
        <div className="loading-container">
          <Spinner />
          <p>{t('searching_for_devices')}</p>
        </div>
      ) : devices.length > 0 ? (
        <div className="devices-container">
          <h2>{t('connected_devices')}</h2>
          <ul>
            {devices.map((device) => (
              <li key={device.id}>
                <Button onClick={() => handleDeviceSelection(device)}>
                  {device.id} - {device.model}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="no-devices-container">
          <h2>{t('no_devices_found')}</h2>
          <p>{t('ensure_device_is_connected')}</p>
          <Button onClick={searchForDevices}>{t('search_again')}</Button>
        </div>
      )}

      {selectedDevice && (
        <div className="video-container">
          <h3>
            {t('streaming_from')}: {selectedDevice.id}
          </h3>
          {/* Video streaming component will go here */}
        </div>
      )}
    </div>
  );
};

export default App;
