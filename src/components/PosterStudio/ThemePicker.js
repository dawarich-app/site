import React from 'react';
import { THEME_KEYS } from '../../lib/poster-studio/data/theme_loader';
import styles from './PosterStudio.module.css';

function themeLabel(key) {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function ThemePicker({ studio }) {
  return (
    <div className={styles.controlGroup} role="group" aria-label="Theme">
      <div className={styles.controlLegend}>Theme</div>
      <div className={styles.themeGrid}>
        {THEME_KEYS.map((key) => {
          const selected = studio.themeKey === key;
          return (
            <button
              key={key}
              type="button"
              data-testid={`theme-chip-${key}`}
              className={selected ? `${styles.themeChip} ${styles.themeChipSelected}` : styles.themeChip}
              style={{ backgroundImage: `url(/img/poster_themes/${key}.webp)` }}
              aria-label={`${themeLabel(key)} theme`}
              aria-pressed={selected}
              title={themeLabel(key)}
              onClick={() => studio.setThemeKey(key)}
            />
          );
        })}
      </div>
    </div>
  );
}
