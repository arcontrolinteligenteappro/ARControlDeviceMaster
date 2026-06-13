import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { IpcChannel } from '@ipc/index';
import { KeyMapping } from '@shared/types/keymapping';
import { Button } from '@ui/button';

interface GamingViewProps {
  deviceId: string;
  onClose: () => void;
}

const GamingView: React.FC<GamingViewProps> = ({ deviceId, onClose }) => {
  const { t } = useTranslation();
  const [profileName, setProfileName] = useState<string>('Default');
  const [mappings, setMappings] = useState<KeyMapping[]>([]);
  const isMapping = useRef<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Logic handled in the backend
    };

    document.addEventListener('keydown', handleKeyDown);

    handleLoadProfile(profileName, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.electron.ipcRenderer.invoke(IpcChannel.STOP_KEYMAPPER);
    };
  }, [deviceId]);

  const handleLoadProfile = async (name: string, isInitialLoad = false) => {
    try {
      const loadedMappings = await window.electron.ipcRenderer.invoke(
        IpcChannel.LOAD_KEYMAP_PROFILE,
        name,
      );

      if (loadedMappings) {
        setMappings(loadedMappings);
        setProfileName(name);

        window.electron.ipcRenderer.invoke(IpcChannel.START_KEYMAPPER, {
          deviceId,
          mappings: loadedMappings,
        });
      } else if (!isInitialLoad) {
        alert(t('Error loading profile. A default mapping will be used.'));
        const defaultMappings: KeyMapping[] = [];
        setMappings(defaultMappings);
        window.electron.ipcRenderer.invoke(IpcChannel.START_KEYMAPPER, {
          deviceId,
          mappings: defaultMappings,
        });
      }
    } catch (error) {
      console.error('Error handling profile loading:', error);
      if (!isInitialLoad) alert(t('An unexpected error occurred.'));
    }
  };

  const handleSaveProfile = async () => {
    try {
      const success = await window.electron.ipcRenderer.invoke(
        IpcChannel.SAVE_KEYMAP_PROFILE,
        { name: profileName, mappings },
      );
      if (success) {
        alert(t('Profile saved successfully!'));
      } else {
        alert(t('Error saving profile.'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(t('An unexpected error occurred while saving.'));
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">
          {t('Gaming Mode')} - {deviceId}
        </h2>
        <Button onClick={onClose} variant="destructive">
          {t('Close')}
        </Button>
      </div>

      <div className="flex-grow bg-gray-900 rounded-lg overflow-hidden mb-4">
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-white">Scrcpy Mirroring Active</p>
        </div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{t('Keymapper')}</h3>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="bg-gray-700 text-white p-2 rounded"
            />
            <Button onClick={() => handleLoadProfile(profileName)}>
              {t('Load')}
            </Button>
            <Button onClick={handleSaveProfile}>{t('Save')}</Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {mappings.map((m) => (
            <div key={m.key} className="bg-gray-700 p-2 rounded text-center">
              <p className="font-bold">{m.key.toUpperCase()}</p>
              <p className="text-sm">{`(${m.x}, ${m.y}) - ${m.type}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamingView;
