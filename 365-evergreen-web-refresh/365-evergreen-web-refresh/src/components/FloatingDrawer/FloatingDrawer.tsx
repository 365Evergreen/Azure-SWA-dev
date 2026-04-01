import React from 'react';
import styles from './FloatingDrawer.module.css';

interface FloatingDrawerProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function FloatingDrawer({ open, onClose, children }: FloatingDrawerProps) {
  return open ? (
    <div className={styles.floatingDrawerRoot}>
      <div className={styles.drawerContentBox}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">×</button>
        <div className={styles.topSpacer} />
        <div className={styles.drawerContent}>{children}</div>
      </div>
    </div>
  ) : null;
}
