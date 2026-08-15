import React from 'react';
import { LAYOUT_CATEGORIES } from '../../lib/poster-studio/data/layouts';
import { DPI_PRESETS } from '../../lib/poster-studio/data/paper_sizes';
import styles from './PosterStudio.module.css';

const CATEGORY_TITLES = { print: 'Print', social: 'Social', wallpaper: 'Wallpaper' };

const LAYOUT_LABELS = {
  'print-a5': 'A5',
  'print-a4': 'A4',
  'print-a3': 'A3',
  'print-a2': 'A2',
  'print-a1': 'A1',
  'print-a0': 'A0',
  'print-30x40': '30 × 40',
  'print-50x70': '50 × 70',
  'print-70x100': '70 × 100',
  'print-letter': 'Letter',
  'print-a4-landscape': 'A4 Landscape',
  'print-a3-landscape': 'A3 Landscape',
  'social-ig-square': 'Instagram Square',
  'social-ig-portrait': 'Instagram Portrait',
  'social-story': 'Story',
  'social-x-header': 'X Header',
  'social-youtube-thumb': 'YouTube Thumbnail',
  'wallpaper-fhd': 'Full HD',
  'wallpaper-4k': '4K',
  'wallpaper-ultrawide': 'Ultrawide',
  'wallpaper-phone': 'Phone',
  'wallpaper-tablet': 'Tablet',
};

export default function LayoutPicker({ studio }) {
  return (
    <div className={styles.controlGroup} role="group" aria-label="Format">
      <div className={styles.controlLegend}>Format</div>
      {LAYOUT_CATEGORIES.map((category) => (
        <div key={category.id} className={styles.layoutCategory}>
          <div className={styles.layoutCategoryTitle}>{CATEGORY_TITLES[category.id]}</div>
          <div className={styles.layoutGrid}>
            {category.layouts.map((layout) => {
              const selected = studio.layoutId === layout.id;
              return (
                <button
                  key={layout.id}
                  type="button"
                  data-testid={`layout-chip-${layout.id}`}
                  className={
                    selected ? `${styles.layoutChip} ${styles.layoutChipSelected}` : styles.layoutChip
                  }
                  aria-pressed={selected}
                  onClick={() => studio.setLayoutId(layout.id)}
                >
                  <span>{LAYOUT_LABELS[layout.id] ?? layout.id}</span>
                  <span className={styles.layoutDims}>{layout.dimensionsLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {studio.layout.kind === 'paper' && (
        <label className={styles.controlRow}>
          <span>Print resolution</span>
          <select
            data-testid="dpi-select"
            value={studio.dpi}
            onChange={(event) => studio.setDpi(Number(event.target.value))}
          >
            {DPI_PRESETS.map((preset) => (
              <option key={preset} value={preset}>
                {preset} DPI
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
