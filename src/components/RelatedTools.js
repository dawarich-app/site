import React from 'react';
import RELATED from '@site/src/data/tool-related-links';
import styles from './RelatedTools.module.css';

export default function RelatedTools({ slug }) {
  const items = RELATED[slug];
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Related tools and pages" className={styles.container}>
      <h2 className={styles.heading}>Related tools &amp; pages</h2>
      <ul className={styles.list}>
        {items.map(item => (
          <li key={item.href} className={styles.item}>
            <a href={item.href} className={styles.link}>
              <span className={styles.label}>{item.label}</span>
              {item.note && <span className={styles.note}>{item.note}</span>}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
