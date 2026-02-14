import React from 'react';
import styles from './StatsCard.module.css';

export default function StatsCard({ icon, label, value, subtitle, color }) {
  return (
    <div className={styles.card} style={color ? { borderTopColor: color } : undefined}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}
