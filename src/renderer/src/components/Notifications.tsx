// src/renderer/src/components/Notifications.tsx
import React, { useState, useEffect } from 'react';
import { IpcEvent } from '../../../main/ipc';

interface Notification {
  id: number;
  message: string;
  type: 'info' | 'error'; // Simple typing for now
}

let notificationId = 0;

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const removeListener = window.api.on(
      IpcEvent.TERMINAL_OUTPUT,
      (event, message: string) => {
        console.log('Received global notification:', message);
        const type = message.toLowerCase().startsWith('error')
          ? 'error'
          : 'info';
        const newNotification: Notification = {
          id: notificationId++,
          message,
          type,
        };

        setNotifications((prev) => [...prev, newNotification]);

        // Auto-dismiss notification after 5 seconds
        setTimeout(() => {
          setNotifications((prev) =>
            prev.filter((n) => n.id !== newNotification.id),
          );
        }, 5000);
      },
    );

    return () => removeListener();
  }, []);

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-800/90 border-red-600';
      default:
        return 'bg-gray-700/90 border-gray-500';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50 flex flex-col items-end space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`px-4 py-3 rounded-md shadow-lg border text-white text-sm w-full animate-fade-in-right ${getBackgroundColor(notif.type)}`}
        >
          {notif.message}
        </div>
      ))}
    </div>
  );
};

export default Notifications;
