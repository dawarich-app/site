import React from 'react';
import styles from './PosterStudio.module.css';

// Opacity range mirrors the app's _studio.html.erb; width is deliberately
// capped at 150% for the site (owner call, 2026-08-15) — the multi-day demo
// gets too heavy above that. Percent values divide by 100 at this seam into
// buildPosterStyle's multiplier inputs.
export default function TrackControls({ studio }) {
  const widthPercent = Math.round(studio.trackWidth * 100);
  const opacityPercent = Math.round(studio.trackOpacity * 100);

  return (
    <div className={styles.controlGroup} role="group" aria-label="Track">
      <div className={styles.controlLegend}>Track</div>
      <label className={styles.controlRow}>
        <span>Color</span>
        <span className={styles.controlRowInline}>
          <input
            type="color"
            data-testid="track-color"
            value={studio.trackColor ?? studio.theme?.route ?? '#FF3B30'}
            onChange={(event) => studio.setTrackColor(event.target.value)}
          />
          <button
            type="button"
            data-testid="track-color-reset"
            className={styles.resetButton}
            disabled={studio.trackColor === null}
            onClick={() => studio.setTrackColor(null)}
          >
            Theme default
          </button>
        </span>
      </label>
      <label className={styles.controlRow}>
        <span>Opacity ({opacityPercent}%)</span>
        <input
          type="range"
          data-testid="opacity-slider"
          min="10"
          max="100"
          step="5"
          value={opacityPercent}
          onChange={(event) => studio.setTrackOpacity(Number.parseInt(event.target.value, 10) / 100)}
        />
      </label>
      <label className={styles.controlRow}>
        <span>Width ({widthPercent}%)</span>
        <input
          type="range"
          data-testid="width-slider"
          min="50"
          max="150"
          step="10"
          value={widthPercent}
          onChange={(event) => studio.setTrackWidth(Number.parseInt(event.target.value, 10) / 100)}
        />
      </label>
    </div>
  );
}
