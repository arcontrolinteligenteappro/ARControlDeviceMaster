// src/renderer/src/components/KeymapperPanel.tsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IpcChannel } from '../../../main/ipc';
import { Device } from '../../../main/modules/devices/Device';
import { KeyMapping } from '../../../main/workers/keymapper.worker';
import { Button } from './ui/button';

interface KeymapperPanelProps {
  devices: Device[];
  activeScrcpySessions: Set<string>;
}

const KeymapperPanel: React.FC<KeymapperPanelProps> = ({
  devices,
  activeScrcpySessions,
}) => {
  const { t } = useTranslation();
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [isMappingActive, setIsMappingActive] = useState(false);
  const [profileName, setProfileName] = useState('default');
  const [mappings, setMappings] = useState<KeyMapping[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const availableDevices = devices.filter((d) =>
    activeScrcpySessions.has(d.id),
  );

  useEffect(() => {
    if (
      selectedDevice &&
      !availableDevices.find((d) => d.id === selectedDevice)
    ) {
      if (isMappingActive) handleStopMapping();
      setSelectedDevice('');
    }
  }, [availableDevices, selectedDevice]);

  useEffect(() => {
    // Cuando el panel se monta, carga el perfil por defecto para el primer dispositivo disponible
    if (availableDevices.length > 0 && !selectedDevice) {
      const firstAvailable = availableDevices[0].id;
      setSelectedDevice(firstAvailable);
      handleLoadProfile(profileName, firstAvailable);
    }
  }, [availableDevices]);

  const handleStartMapping = async () => {
    if (!selectedDevice) return;
    try {
      await window.electron.ipcRenderer.invoke(IpcChannel.START_KEYMAPPER, {
        deviceId: selectedDevice,
        mappings,
      });
      setIsMappingActive(true);
    } catch (error) {
      console.error('Failed to start keymapper:', error);
    }
  };

  const handleStopMapping = async () => {
    try {
      await window.electron.ipcRenderer.invoke(IpcChannel.STOP_KEYMAPPER);
      setIsMappingActive(false);
    } catch (error) {
      console.error('Failed to stop keymapper:', error);
    }
  };

  const handleLoadProfile = async (name: string, deviceId: string) => {
    try {
      const loadedMappings = await window.electron.ipcRenderer.invoke(
        IpcChannel.LOAD_KEYMAP_PROFILE,
        name,
      );
      if (loadedMappings) {
        setMappings(loadedMappings);
        setProfileName(name);
        // Si el mapeo ya está activo, reinícialo con los nuevos mappings
        if (isMappingActive) {
          await window.electron.ipcRenderer.invoke(IpcChannel.START_KEYMAPPER, {
            deviceId,
            mappings: loadedMappings,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await window.electron.ipcRenderer.invoke(IpcChannel.SAVE_KEYMAP_PROFILE, {
        name: profileName,
        mappings,
      });
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
      <h3 className="text-xl text-cyan-400 font-bold">{t('Keymapper')}</h3>
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white"
        />
        <Button onClick={() => handleLoadProfile(profileName, selectedDevice)}>
          {t('Load')}
        </Button>
        <Button onClick={handleSaveProfile} disabled={isSaving}>
          {isSaving ? t('Saving...') : t('Save')}
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          disabled={isMappingActive}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-white flex-grow"
        >
          <option value="">-- {t('Select Device')} --</option>
          {availableDevices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.model || device.id}
            </option>
          ))}
        </select>
        <Button
          onClick={isMappingActive ? handleStopMapping : handleStartMapping}
          disabled={!selectedDevice}
          variant={isMappingActive ? 'destructive' : 'default'}
        >
          {isMappingActive ? t('Stop Mapper') : t('Start Mapper')}
        </Button>
      </div>

      {isMappingActive && (
        <div className="mt-4 p-2 bg-green-900/50 rounded">
          <p className="text-green-300 font-semibold">
            {t('Keymapper is active on')} {selectedDevice}
          </p>
        </div>
      )}
    </div>
  );
};

export default KeymapperPanel;
