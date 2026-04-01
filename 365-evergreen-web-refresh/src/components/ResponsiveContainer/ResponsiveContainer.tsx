import React from 'react';
import styles from './ResponsiveContainer.module.css';

export default function ResponsiveContainer({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`${styles.container} ${className ?? ''}`.trim()}>{children}</div>;
}
