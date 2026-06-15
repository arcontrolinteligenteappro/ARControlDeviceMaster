import React from 'react';
import DeviceCard from './DeviceCard';
import bg from '../assets/bg_conectados.png';
import styles from './DevicesGrid.module.css';

export default function DevicesGrid({ devices }: any) {
  return (
    <div
      style={{ backgroundImage: `url(${bg})` }}
      className={styles.gridContainer}
    >
      <h1 className={styles.title}>AR CONTROL GRID</h1>

      <div className={styles.gridSystem}>
        {devices.map((d: any) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}
