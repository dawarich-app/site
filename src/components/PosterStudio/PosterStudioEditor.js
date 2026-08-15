// Root of the maplibre lazy boundary. Everything that (transitively) touches
// maplibre-gl — PreviewMap, ui/preview.js, and later the exporter and order
// flow — must stay inside this module tree; the page loads it only via
// React.lazy inside <BrowserOnly>.
import React, { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import { POSTER_FONTS, ensurePosterFont, fontByKey } from '../../lib/poster-studio/data/fonts';
import ExportControls from './ExportControls';
import LayoutPicker from './LayoutPicker';
import OrderDialog from './OrderDialog';
import PreviewMap from './PreviewMap';
import TextControls from './TextControls';
import ThemePicker from './ThemePicker';
import TrackControls from './TrackControls';
import { usePosterStudio } from './usePosterStudio';
import styles from './PosterStudio.module.css';

export const FONT_URLS = {
  'inter-400': '/fonts/poster/inter-400.woff2',
  'inter-700': '/fonts/poster/inter-700.woff2',
  'oswald-400': '/fonts/poster/oswald-400.woff2',
  'oswald-700': '/fonts/poster/oswald-700.woff2',
  'playfair-display-400': '/fonts/poster/playfair-display-400.woff2',
  'playfair-display-700': '/fonts/poster/playfair-display-700.woff2',
  'jetbrains-mono-400': '/fonts/poster/jetbrains-mono-400.woff2',
  'jetbrains-mono-700': '/fonts/poster/jetbrains-mono-700.woff2',
};

export default function PosterStudioEditor({ trackGeojson, fallbackBounds }) {
  const studio = usePosterStudio(trackGeojson);
  const previewRef = useRef(null);

  // Preload ALL four families on mount — loading only on font change would
  // leave the default Oswald unresolved and silently fall back in canvas 2D.
  useEffect(() => {
    Promise.allSettled(
      POSTER_FONTS.map((font) => ensurePosterFont(font.key, FONT_URLS)),
    ).then(() => previewRef.current?.redraw());
  }, []);

  // Safety net on font change (already-preloaded fonts resolve instantly).
  useEffect(() => {
    let cancelled = false;
    ensurePosterFont(studio.fontKey, FONT_URLS)
      .then(() => {
        if (!cancelled) previewRef.current?.redraw();
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [studio.fontKey]);

  if (studio.themeError) {
    return (
      <div className={styles.notice} role="alert">
        The poster theme failed to load — reload the page to try again.
      </div>
    );
  }
  if (!studio.style) {
    return <div className={styles.notice}>Loading the poster theme…</div>;
  }

  const fontFamily = `"${fontByKey(studio.fontKey).family}", sans-serif`;

  return (
    <div className={styles.editorGrid} data-testid="poster-studio">
      <PreviewMap
        ref={previewRef}
        style={studio.style}
        trackGeojson={trackGeojson}
        fallbackBounds={fallbackBounds}
        layout={studio.layout}
        theme={studio.theme}
        title={studio.title}
        subtitle={studio.subtitle}
        showCoords={studio.showCoords}
        showAttribution={studio.showAttribution}
        fontFamily={fontFamily}
      />
      <div className={styles.controlsColumn}>
        <ThemePicker studio={studio} />
        <TrackControls studio={studio} />
        <TextControls studio={studio} />
        <LayoutPicker studio={studio} />
        <ExportControls studio={studio} previewRef={previewRef} />
        <OrderDialog studio={studio} previewRef={previewRef} />
      </div>
    </div>
  );
}
