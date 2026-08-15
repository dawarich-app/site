// Live MapLibre preview inside a layout-aspect frame, with the poster text
// overlay drawn on a canvas above it. Mirrors the app's Stimulus controller:
// dpr-sized overlay backing store, clearRect before every draw, redraw on
// state change / stage resize / map move, frame refit via fitFrame.
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { drawOverlay } from '../../lib/poster-studio/render/overlay';
import { formatCoords } from '../../lib/poster-studio/render/text_layout';
import { createPreviewMap, fitFrame, trackBounds } from '../../lib/poster-studio/ui/preview';
import styles from './PosterStudio.module.css';

const RESTYLE_DEBOUNCE_MS = 150;

function PreviewMap(
  {
    style,
    trackGeojson,
    layout,
    theme,
    title,
    subtitle,
    showCoords,
    showAttribution,
    fontFamily,
    fallbackBounds,
  },
  ref,
) {
  const stageRef = useRef(null);
  const frameRef = useRef(null);
  const mapContainerRef = useRef(null);
  const overlayRef = useRef(null);
  const mapRef = useRef(null);
  const overlayState = useRef({});
  overlayState.current = { theme, title, subtitle, showCoords, showAttribution, fontFamily };

  const redrawOverlay = useCallback(() => {
    const canvas = overlayRef.current;
    const frame = frameRef.current;
    const state = overlayState.current;
    if (!canvas || !frame || !state.theme) return;
    const context = canvas.getContext && canvas.getContext('2d');
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(frame.clientWidth * dpr);
    canvas.height = Math.round(frame.clientHeight * dpr);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawOverlay(canvas, {
      theme: state.theme,
      title: state.title.trim(),
      subtitle: state.subtitle.trim(),
      coords: state.showCoords ? formatCoords(mapRef.current?.getCenter()) : '',
      font: state.fontFamily,
      ...(state.showAttribution ? {} : { attribution: '' }),
    });
  }, []);

  const resizeFrame = useCallback(() => {
    const stage = stageRef.current;
    const frame = frameRef.current;
    if (!stage || !frame) return;
    const { width, height } = fitFrame(stage, layout.aspect);
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
    mapRef.current?.resize();
    redrawOverlay();
  }, [layout, redrawOverlay]);

  const recenter = useCallback(() => {
    const bounds = trackBounds(trackGeojson) ?? fallbackBounds;
    if (bounds) mapRef.current?.fitBounds(bounds, { padding: 24 });
  }, [trackGeojson, fallbackBounds]);

  useImperativeHandle(
    ref,
    () => ({
      getMap: () => mapRef.current,
      getFrame: () => frameRef.current,
      redraw: redrawOverlay,
      recenter,
    }),
    [redrawOverlay, recenter],
  );

  // Mount once: size the frame first (app parity), then create the map and
  // observe the STAGE — never the frame, which we resize ourselves.
  useEffect(() => {
    resizeFrame();
    const map = createPreviewMap({
      container: mapContainerRef.current,
      style,
      bounds: trackBounds(trackGeojson) ?? fallbackBounds,
    });
    mapRef.current = map;
    map.on('move', redrawOverlay);
    map.once('load', redrawOverlay);

    const observer = new ResizeObserver(() => resizeFrame());
    observer.observe(stageRef.current);

    return () => {
      observer.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Style changes restyle the existing map, debounced like the app does for
  // its slider storms. The initial style already went into the constructor.
  const styleApplied = useRef(false);
  useEffect(() => {
    if (!styleApplied.current) {
      styleApplied.current = true;
      return undefined;
    }
    const timer = setTimeout(() => {
      mapRef.current?.setStyle(style);
      redrawOverlay();
    }, RESTYLE_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [style, redrawOverlay]);

  useEffect(() => {
    resizeFrame();
  }, [resizeFrame]);

  useEffect(() => {
    redrawOverlay();
  }, [theme, title, subtitle, showCoords, showAttribution, fontFamily, redrawOverlay]);

  return (
    <div className={styles.stage} ref={stageRef}>
      <div className={styles.frame} ref={frameRef} data-poster-role="frame" data-testid="poster-frame">
        <div className={styles.mapContainer} ref={mapContainerRef} data-testid="poster-map" />
        <canvas className={styles.overlay} ref={overlayRef} data-testid="poster-overlay" />
      </div>
      <div className={styles.stageFooter} data-poster-role="chrome">
        <span className={styles.hint}>{layout.dimensionsLabel}</span>
        <button type="button" className={styles.recenterButton} onClick={recenter} data-testid="poster-recenter">
          Recenter
        </button>
      </div>
    </div>
  );
}

export default forwardRef(PreviewMap);
