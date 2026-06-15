import React from 'react';
import styles from './TransitionWrapper.module.css';

export const TransitionWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className={styles.fadeWrapper}>{children}</div>;
