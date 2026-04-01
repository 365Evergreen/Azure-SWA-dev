import * as React from 'react';
import { DrawerBody, Drawer } from '@fluentui/react-components';
import styles from './DrawerPanel.module.css';

interface DrawerPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}

export function DrawerPanel({ open, onClose, title, children }: DrawerPanelProps) {
  return (
    <Drawer
      open={open}
      position="end"
      onOpenChange={(_e, data) => {
        if (!data.open) onClose();
      }}
      modalType="modal"
      size="large"
    >
      <div className={styles.customDrawerRoot}>
        <button className={styles.drawerCloseBtn} onClick={onClose} aria-label="Close panel">×</button>
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>{title || 'Panel'}</div>
          <div className={styles.drawerSubtitle}>A few quick questions to understand your culture and collaboration goals.</div>
        </div>
        <DrawerBody className={styles.drawerBody}>
          {children}
        </DrawerBody>
      </div>
    </Drawer>
  );
}
