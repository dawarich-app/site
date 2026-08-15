import React from 'react';
import { POSTER_FONTS } from '../../lib/poster-studio/data/fonts';
import styles from './PosterStudio.module.css';

export default function TextControls({ studio }) {
  return (
    <div className={styles.controlGroup} role="group" aria-label="Text">
      <div className={styles.controlLegend}>Text</div>
      <label className={styles.controlRow}>
        <span>Title</span>
        <input
          type="text"
          data-testid="title-input"
          value={studio.title}
          maxLength={60}
          placeholder="Berlin"
          onChange={(event) => studio.setTitle(event.target.value)}
        />
      </label>
      <label className={styles.controlRow}>
        <span>Subtitle</span>
        <input
          type="text"
          data-testid="subtitle-input"
          value={studio.subtitle}
          maxLength={80}
          placeholder="Summer 2026"
          onChange={(event) => studio.setSubtitle(event.target.value)}
        />
      </label>
      <label className={styles.controlRowInline}>
        <input
          type="checkbox"
          data-testid="coords-toggle"
          checked={studio.showCoords}
          onChange={(event) => studio.setShowCoords(event.target.checked)}
        />
        <span>Show coordinates</span>
      </label>
      <label className={styles.controlRowInline}>
        <input
          type="checkbox"
          data-testid="attribution-toggle"
          checked={studio.showAttribution}
          onChange={(event) => studio.setShowAttribution(event.target.checked)}
        />
        <span>Show attribution line</span>
      </label>
      <label className={styles.controlRow}>
        <span>Font</span>
        <select
          data-testid="font-select"
          value={studio.fontKey}
          onChange={(event) => studio.setFontKey(event.target.value)}
        >
          {POSTER_FONTS.map((font) => (
            <option key={font.key} value={font.key}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
