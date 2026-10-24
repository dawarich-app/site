import React from 'react';
import { DAWARICH_BLUE } from '../../utils/videoExport/colorUtil';
import styles from './VideoStudio.module.css';
import { MAX_DURATION_SEC, MIN_DURATION_SEC, VIDEO_FORMATS } from './useVideoStudio';

function prettyThemeName(key) {
  return key.replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function Segmented({ label, options, value, onChange, testPrefix }) {
  return (
    <div className={styles.controlRow}>
      <span className={styles.controlLabel}>{label}</span>
      <div className={styles.segmented} role="radiogroup" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            className={`${styles.segment} ${value === option.value ? styles.segmentActive : ''}`}
            onClick={() => onChange(option.value)}
            data-testid={`${testPrefix}-${option.value}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function VideoControls({ studio, disabled }) {
  const {
    themeKey,
    setThemeKey,
    themeKeys,
    theme,
    formatKey,
    setFormatKey,
    durationSec,
    setDurationSec,
    cameraMode,
    setCameraMode,
    followZoom,
    setFollowZoom,
    trackColor,
    setTrackColor,
    trackWidth,
    setTrackWidth,
    units,
    setUnits,
  } = studio;

  return (
    <fieldset className={styles.controls} disabled={disabled}>
      <div className={styles.group} role="group" aria-label="Map style">
        <span className={styles.groupLegend}>Map style</span>
        <div className={styles.themeGrid}>
          {themeKeys.map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.themeChip} ${themeKey === key ? styles.themeChipSelected : ''}`}
              style={{ backgroundImage: `url(/img/poster_themes/${key}.webp)` }}
              aria-label={`${prettyThemeName(key)} theme`}
              aria-pressed={themeKey === key}
              title={prettyThemeName(key)}
              onClick={() => setThemeKey(key)}
              data-testid={`video-theme-${key}`}
            />
          ))}
        </div>
        <div className={styles.controlRow}>
          <span className={styles.controlLabel}>Route color</span>
          <div className={styles.colorRow}>
            <input
              type="color"
              aria-label="Route color"
              value={trackColor ?? theme?.route ?? DAWARICH_BLUE}
              onChange={(event) => setTrackColor(event.target.value)}
              data-testid="video-color"
            />
            {trackColor && (
              <button
                type="button"
                className={styles.linkButton}
                onClick={() => setTrackColor(null)}
              >
                Theme default
              </button>
            )}
          </div>
        </div>
        <label className={styles.controlRow}>
          <span className={styles.controlLabel}>
            Line width <span className={styles.controlValue}>{trackWidth.toFixed(1)}×</span>
          </span>
          <input
            type="range"
            min={0.6}
            max={2.4}
            step={0.2}
            value={trackWidth}
            onChange={(event) => setTrackWidth(Number(event.target.value))}
            data-testid="video-width"
          />
        </label>
      </div>

      <div className={styles.group} role="group" aria-label="Video">
        <span className={styles.groupLegend}>Video</span>
        <Segmented
          label="Format"
          testPrefix="video-format"
          value={formatKey}
          onChange={setFormatKey}
          options={Object.entries(VIDEO_FORMATS).map(([value, format]) => ({
            value,
            label: format.label,
          }))}
        />
        <label className={styles.controlRow}>
          <span className={styles.controlLabel}>
            Length <span className={styles.controlValue}>{durationSec} s</span>
          </span>
          <input
            type="range"
            min={MIN_DURATION_SEC}
            max={MAX_DURATION_SEC}
            step={1}
            value={durationSec}
            onChange={(event) => setDurationSec(Number(event.target.value))}
            data-testid="video-duration"
          />
        </label>
        <Segmented
          label="Camera"
          testPrefix="video-camera"
          value={cameraMode}
          onChange={setCameraMode}
          options={[
            { value: 'overview', label: 'Whole route' },
            { value: 'follow', label: 'Follow the pen' },
          ]}
        />
        {cameraMode === 'follow' && (
          <label className={styles.controlRow}>
            <span className={styles.controlLabel}>
              Follow zoom <span className={styles.controlValue}>{followZoom.toFixed(1)}</span>
            </span>
            <input
              type="range"
              min={11}
              max={15}
              step={0.5}
              value={followZoom}
              onChange={(event) => setFollowZoom(Number(event.target.value))}
              data-testid="video-follow-zoom"
            />
          </label>
        )}
      </div>

      <div className={styles.group} role="group" aria-label="Output">
        <span className={styles.groupLegend}>Output</span>
        <Segmented
          label="Units"
          testPrefix="video-units"
          value={units}
          onChange={setUnits}
          options={[
            { value: 'km', label: 'Kilometers' },
            { value: 'mi', label: 'Miles' },
          ]}
        />
      </div>
    </fieldset>
  );
}
