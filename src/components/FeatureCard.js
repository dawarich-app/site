import React from 'react';
import styles from './FeatureCard.module.css';

/**
 * Reusable card component for feature pages
 * Supports different layouts: icon-top (default), icon-left, or no-icon
 */
export default function FeatureCard({
  icon,
  title,
  description,
  children,
  layout = 'icon-top', // 'icon-top', 'icon-left', 'no-icon'
  className = '',
}) {
  const layoutClass = layout === 'icon-left' ? styles.iconleft :
                      layout === 'no-icon' ? styles.noicon :
                      styles.icontop;

  return (
    <div className={`${styles.card} ${layoutClass} ${className}`}>
      {icon && layout === 'icon-left' && (
        <div className={styles.iconLeft}>{icon}</div>
      )}
      <div className={styles.content}>
        {icon && layout === 'icon-top' && (
          <div className={styles.iconTop}>{icon}</div>
        )}
        {title && <h3 className={styles.title}>{title}</h3>}
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </div>
  );
}

/**
 * Grid wrapper for feature cards
 */
export function FeatureCardGrid({ children, columns = 'auto' }) {
  const columnClass = columns === 'auto' ? styles.gridAuto :
                      columns === 2 ? styles.grid2 :
                      columns === 3 ? styles.grid3 :
                      columns === 4 ? styles.grid4 :
                      styles.gridAuto;

  return <div className={`${styles.grid} ${columnClass}`}>{children}</div>;
}
