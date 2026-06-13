// src/renderer/src/components/buttons/AdbRebootButton.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button'; // Asumiendo que usas un componente Button de ui
import { IpcChannel } from '../../../ipc';

interface AdbRebootButtonProps {
  deviceId: string;
  isOnline: boolean;
}

const AdbRebootButton: React.FC<AdbRebootButtonProps> = ({
  deviceId,
  isOnline,
}) => {
  const { t } = useTranslation();
  const [isRebooting, setIsRebooting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!isOnline || isRebooting) return;

    setIsRebooting(true);
    setError(null);

    try {
      const result = await window.electron.ipcRenderer.invoke(
        IpcChannel.REBOOT_DEVICE,
        { deviceId },
      );
      if (!result.success) {
        throw new Error(result.error || 'Unknown error occurred');
      }
      // El dispositivo se reiniciará. El DeviceManager actualizará su estado automáticamente.
      // No es necesario cambiar el estado aquí, solo esperar a la actualización del backend.
    } catch (err: any) {
      console.error('Failed to reboot device:', err);
      setError(err.message || 'Failed to send reboot command.');
      // Opcional: resetear el estado de error después de un tiempo
      setTimeout(() => setError(null), 5000);
    } finally {
      // Permitir que el usuario intente de nuevo incluso si falló
      setIsRebooting(false);
    }
  };

  const getButtonLabel = () => {
    if (isRebooting) {
      return t('Rebooting...');
    }
    if (error) {
      return t('Error');
    }
    return t('Reboot');
  };

  const getButtonVariant = () => {
    if (error) return 'destructive';
    if (isRebooting) return 'secondary';
    return 'outline';
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!isOnline || isRebooting}
      variant={getButtonVariant()}
      size="sm"
      aria-label={error || getButtonLabel()}
    >
      {getButtonLabel()}
    </Button>
  );
};

export default AdbRebootButton;
