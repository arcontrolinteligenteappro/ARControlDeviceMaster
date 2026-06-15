import React from 'react';
import { RadarInterface } from './RadarInterface';
import { TacticalGrid } from './TacticalGrid';
import styles from './DashboardManager.module.css';

interface DashboardManagerProps {
  devices: any[];
}

export const DashboardManager: React.FC<DashboardManagerProps> = ({
  devices,
}) => {
  const isOperational = devices.length > 0;

  return (
    <div className={styles.dashboardContainer}>
      {isOperational ? <TacticalGrid devices={devices} /> : <RadarInterface />}
    </div>
  );
};
