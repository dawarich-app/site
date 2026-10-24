// Assembles the studio surface: stage (preview / result), control rail, and
// the action bar that owns the render lifecycle. Loaded lazily behind
// BrowserOnly — maplibre and mp4-muxer never reach the SSR bundle.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DAWARICH_BLUE } from '../../utils/videoExport/colorUtil';
import { buildStatRows, computeTrackStats } from '../../utils/videoExport/videoStats';
import { isVideoExportSupported } from '../../utils/videoExport/mp4Encoder';
import styles from './VideoStudio.module.css';
import { useVideoStudio } from './useVideoStudio';
import VideoControls from './VideoControls';
import VideoPreviewMap from './VideoPreviewMap';

export default function VideoStudioEditor({ trackGeojson, points, fallbackBounds }) {
  const studio = useVideoStudio(trackGeojson);
  const [supported, setSupported] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [renderError, setRenderError] = useState(null);
  const abortRef = useRef(null);

  const stats = useMemo(() => computeTrackStats(points), [points]);
  const statRows = useMemo(() => buildStatRows(stats, studio.units), [stats, studio.units]);

  useEffect(() => {
    setSupported(isVideoExportSupported());
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => () => result && URL.revokeObjectURL(result.url), [result]);

  // The finished video overlays the preview frame, so a settings change while
  // it is showing would edit the map invisibly — dismiss the result instead
  // and drop back to the live preview.
  const settingsKey = JSON.stringify([
    studio.themeKey,
    studio.formatKey,
    studio.trackColor,
    studio.trackWidth,
    studio.cameraMode,
    studio.followZoom,
    studio.durationSec,
    studio.units,
  ]);
  const lastSettingsRef = useRef(settingsKey);
  useEffect(() => {
    if (lastSettingsRef.current === settingsKey) return;
    lastSettingsRef.current = settingsKey;
    setResult(null);
  }, [settingsKey]);

  const handleRender = async () => {
    if (!studio.style || rendering) return;
    setRenderError(null);
    setResult(null);
    setRendering(true);
    setProgress({ done: 0, total: 0 });
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const { renderRouteVideo } = await import('../../utils/videoExport/videoRenderer');
      const { blob } = await renderRouteVideo({
        style: studio.style,
        trackGeojson,
        points,
        stats,
        width: studio.format.width,
        height: studio.format.height,
        durationSec: studio.durationSec,
        cameraMode: studio.cameraMode,
        followZoom: studio.followZoom,
        accent: studio.trackColor ?? studio.theme?.route ?? DAWARICH_BLUE,
        units: studio.units,
        onProgress: (done, total) => setProgress({ done, total }),
        signal: controller.signal,
      });
      setResult({ url: URL.createObjectURL(blob), sizeBytes: blob.size });
    } catch (error) {
      if (error.message !== 'Render cancelled') setRenderError(error.message);
    } finally {
      setRendering(false);
      abortRef.current = null;
    }
  };

  const sizeMb = result ? (result.sizeBytes / (1024 * 1024)).toFixed(1) : null;

  return (
    <div className={styles.studio}>
      <div className={styles.stage}>
        {studio.style ? (
          <VideoPreviewMap
            style={studio.style}
            trackGeojson={trackGeojson}
            fallbackBounds={fallbackBounds}
            formatKey={studio.formatKey}
            resultUrl={result?.url ?? null}
            statRows={statRows}
          />
        ) : (
          <p className={styles.loadingNote}>
            {studio.themeError ? 'The map theme failed to load.' : 'Loading the map theme…'}
          </p>
        )}
      </div>

      <aside className={styles.rail} aria-label="Video settings">
        <VideoControls studio={studio} disabled={rendering} />
      </aside>

      <div className={styles.actionBar}>
        {rendering ? (
          <>
            <div className={styles.barStatus} data-testid="video-progress" aria-live="polite">
              Rendering frame <strong>{progress.done}</strong> of{' '}
              <strong>{progress.total || '…'}</strong>
            </div>
            <div className={styles.progressTrack} aria-hidden="true">
              <div
                className={styles.progressFill}
                style={{
                  transform: `scaleX(${progress.total ? progress.done / progress.total : 0})`,
                }}
              />
            </div>
            <div className={styles.barActions}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => abortRef.current?.abort()}
              >
                Cancel
              </button>
            </div>
          </>
        ) : result ? (
          <>
            <div className={styles.barStatus} aria-live="polite">
              <strong>Your video is ready.</strong> Playing above — download it or go back to
              editing.
            </div>
            <div className={styles.barActions}>
              <button
                type="button"
                className={styles.ghostButton}
                onClick={() => setResult(null)}
                data-testid="video-edit-again"
              >
                Edit again
              </button>
              <a
                className={styles.downloadButton}
                href={result.url}
                download="dawarich-route-video.mp4"
                data-testid="video-download"
              >
                Download MP4 · {sizeMb} MB
              </a>
            </div>
          </>
        ) : (
          <>
            <div className={styles.barStatus} role={renderError || !supported ? 'alert' : undefined}>
              {renderError ? (
                <span className={styles.railError}>{renderError}</span>
              ) : !supported ? (
                'This browser cannot encode video files — the preview works, but rendering needs a current Chrome, Edge, Safari, or Firefox.'
              ) : (
                'Rendered on your device — your file never leaves the browser.'
              )}
            </div>
            <div className={styles.barActions}>
              <button
                type="button"
                className={styles.renderButton}
                onClick={handleRender}
                disabled={!supported || !studio.style}
                data-testid="video-render"
              >
                Render video
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
