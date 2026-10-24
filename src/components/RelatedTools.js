import React from 'react';
import { translate } from '@docusaurus/Translate';
import RELATED from '@locale-content/shared/tool-related-links.json';
import { SmartLink } from '@site/src/i18n/RichText';
import styles from './RelatedTools.module.css';

export default function RelatedTools({ slug }) {
  const items = RELATED[slug];
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label={translate({ id: 'shared.relatedTools.ariaLabel', message: 'Related tools and pages' })}
      className={styles.container}
    >
      <h2 className={styles.heading}>
        {translate({ id: 'shared.relatedTools.heading', message: 'Related tools & pages' })}
      </h2>
      <ul className={styles.list}>
        {items.map(item => (
          <li key={item.href} className={styles.item}>
            <SmartLink href={item.href} className={styles.link}>
              <span className={styles.label}>{item.label}</span>
              {item.note && <span className={styles.note}>{item.note}</span>}
            </SmartLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
