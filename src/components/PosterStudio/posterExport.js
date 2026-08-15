// Site-owned mirror of the vendored ui/exporter.js exportPoster() with ONE
// insertion: the blank-canvas sanity check between drawOverlay and encoding.
// The vendored function encapsulates its canvas, so the check cannot hook
// into it from outside — keep this body in lockstep with ui/exporter.js
// whenever the drift check reports upstream changes there.
import { resolveLayoutGeometry } from '../../lib/poster-studio/data/layouts';
import { PAPER_SIZES } from '../../lib/poster-studio/data/paper_sizes';
import { pdfBlob, pngBlob } from '../../lib/poster-studio/export/download';
import { encodePdf } from '../../lib/poster-studio/export/pdf_encoder';
import { encodePng } from '../../lib/poster-studio/export/png_encoder';
import { captureBounds } from '../../lib/poster-studio/render/offscreen_map';
import { drawOverlay } from '../../lib/poster-studio/render/overlay';
import { isCanvasBlank } from './exportBudget';

export async function renderAndEncodePoster({
  style,
  bounds,
  layout,
  dpi,
  format,
  theme,
  text,
  font,
  cssSize,
  signal,
}) {
  const geometry = resolveLayoutGeometry(layout, dpi);
  const canvas = await captureBounds({
    style,
    bounds,
    width: geometry.width,
    height: geometry.height,
    cssSize,
    signal,
  });
  drawOverlay(canvas, { theme, ...text, font });

  if (isCanvasBlank(canvas)) {
    throw new Error(
      'The export produced a blank canvas — this device cannot render the poster at this size. Try a lower DPI or a smaller format.',
    );
  }

  if (format === 'pdf' && layout.kind === 'paper') {
    const paper = PAPER_SIZES[layout.paperKey];
    const [widthMm, heightMm] = layout.landscape
      ? [paper.hmm, paper.wmm]
      : [paper.wmm, paper.hmm];
    const bytes = await encodePdf(canvas, { widthMm, heightMm });
    return { blob: pdfBlob(bytes), extension: 'pdf', geometry };
  }

  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const bytes = encodePng(new Uint8Array(data.buffer), canvas.width, canvas.height, geometry.effectiveDpi);
  return { blob: pngBlob(bytes), extension: 'png', geometry };
}
