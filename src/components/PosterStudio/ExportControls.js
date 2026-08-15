import React, { useEffect, useRef, useState } from 'react';
import { downloadBlob } from '../../lib/poster-studio/export/download';
import { fontByKey } from '../../lib/poster-studio/data/fonts';
import { formatCoords } from '../../lib/poster-studio/render/text_layout';
import { studioFilename } from '../../lib/poster-studio/ui/exporter';
import { clampDpiForBudget, detectAreaBudget } from './exportBudget';
import { renderAndEncodePoster } from './posterExport';
import styles from './PosterStudio.module.css';

export default function ExportControls({ studio, previewRef }) {
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const abortRef = useRef(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  async function handleExport(format) {
    if (busy) return;
    const map = previewRef.current?.getMap();
    const frame = previewRef.current?.getFrame();
    if (!map || !frame || !studio.style) return;

    setBusy(true);
    setNotice(null);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const { dpi, areaClamped } = clampDpiForBudget(studio.layout, studio.dpi, detectAreaBudget());
      const result = await renderAndEncodePoster({
        style: studio.style,
        bounds: map.getBounds(),
        layout: studio.layout,
        dpi,
        format,
        theme: studio.theme,
        text: {
          title: studio.title.trim(),
          subtitle: studio.subtitle.trim(),
          coords: studio.showCoords ? formatCoords(map.getCenter()) : '',
          ...(studio.showAttribution ? {} : { attribution: '' }),
        },
        font: `"${fontByKey(studio.fontKey).family}", sans-serif`,
        cssSize: { width: frame.clientWidth, height: frame.clientHeight },
        signal: controller.signal,
      });
      downloadBlob(result.blob, studioFilename(studio.title, studio.layout, result.extension));
      setDownloaded(true);
      if (result.geometry.steppedDown || areaClamped) {
        const dpiNote = result.geometry.effectiveDpi
          ? ` (${result.geometry.effectiveDpi} DPI)`
          : '';
        setNotice(`Exported at this device's maximum resolution${dpiNote}.`);
      }
    } catch (exportError) {
      if (exportError?.message !== 'Poster export aborted') {
        setError(exportError?.message || 'Export failed — try again.');
      }
    } finally {
      abortRef.current = null;
      setBusy(false);
    }
  }

  return (
    <div className={styles.controlGroup} data-testid="export-controls">
      <div className={styles.exportRow}>
        <button
          type="button"
          data-testid="export-png"
          className={styles.exportButton}
          disabled={busy}
          onClick={() => handleExport('png')}
        >
          {busy ? 'Exporting…' : 'Download PNG'}
        </button>
        {studio.layout.kind === 'paper' && (
          <button
            type="button"
            data-testid="export-pdf"
            className={styles.exportButton}
            disabled={busy}
            onClick={() => handleExport('pdf')}
          >
            {busy ? 'Exporting…' : 'Download PDF'}
          </button>
        )}
      </div>
      <p className={styles.freeNote}>Free, unlimited, no watermark, no account.</p>
      {notice && (
        <p className={styles.exportNotice} data-testid="export-notice">
          {notice}
        </p>
      )}
      {error && (
        <p className={styles.exportError} data-testid="export-error" role="alert">
          {error}
        </p>
      )}
      {downloaded && !error && (
        <p className={styles.exportUpsell} data-testid="export-upsell">
          Looks even better on paper — 200 gsm matte, free EU shipping, from €44.99 below.
        </p>
      )}
    </div>
  );
}
