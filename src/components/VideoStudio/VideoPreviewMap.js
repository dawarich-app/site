// The studio stage: a framed live map in the output aspect ratio. The full
// route is shown for framing; the animation only exists in the rendered file,
// which overlays the same frame when a render finishes.
import React, { Fragment, useEffect, useRef } from 'react';
import { createPreviewMap, trackBounds } from '../../lib/poster-studio/ui/preview';
import styles from './VideoStudio.module.css';

const RESTYLE_DEBOUNCE_MS = 150;

const FRAME_CLASS_BY_FORMAT = {
  portrait: 'framePortrait',
  landscape: 'frameLandscape',
  square: 'frameSquare',
};

export default function VideoPreviewMap({
  style,
  trackGeojson,
  fallbackBounds,
  formatKey,
  resultUrl,
  statRows,
}) {
  const frameRef = useRef(null);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = createPreviewMap({
      container: mapContainerRef.current,
      style,
      bounds: trackBounds(trackGeojson) ?? fallbackBounds,
    });
    mapRef.current = map;

    const observer = new ResizeObserver(() => map.resize());
    observer.observe(frameRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const styleApplied = useRef(false);
  useEffect(() => {
    if (!styleApplied.current) {
      styleApplied.current = true;
      return undefined;
    }
    const timer = setTimeout(() => mapRef.current?.setStyle(style), RESTYLE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [style]);

  const recenter = () => {
    const bounds = trackBounds(trackGeojson) ?? fallbackBounds;
    if (bounds) mapRef.current?.fitBounds(bounds, { padding: 24 });
  };

  return (
    <Fragment>
      <div
        className={`${styles.frame} ${styles[FRAME_CLASS_BY_FORMAT[formatKey]]}`}
        ref={frameRef}
        data-testid="video-frame"
      >
        <div className={styles.mapContainer} ref={mapContainerRef} data-testid="video-map" />
        {resultUrl ? (
          /* eslint-disable-next-line jsx-a11y/media-has-caption */
          <video
            className={styles.resultVideo}
            src={resultUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
            data-testid="video-result"
          />
        ) : (
          <button
            type="button"
            className={styles.recenterButton}
            onClick={recenter}
            data-testid="video-recenter"
          >
            Recenter
          </button>
        )}
      </div>
      {statRows?.length > 0 && (
        <p className={styles.stageCaption} data-testid="video-stats">
          {statRows.map(([label, value], index) => (
            <Fragment key={label}>
              {index > 0 && (
                <span className={styles.captionDivider} aria-hidden="true">
                  ·
                </span>
              )}
              <span aria-label={`${label}: ${value}`}>
                <strong>{value}</strong>
              </span>
            </Fragment>
          ))}
        </p>
      )}
    </Fragment>
  );
}
