// Order orchestration for the print path: render the forced-300dpi PDF
// (renderAndEncodePoster runs the blank-canvas check before returning), then
// upload it via the vendored order client. Never add custom headers to the
// order request — it is a CORS-simple POST and the server answers no
// preflight.
import { fontByKey } from '../../lib/poster-studio/data/fonts';
import { printProductFor } from '../../lib/poster-studio/data/print_products';
import { formatCoords } from '../../lib/poster-studio/render/text_layout';
import { submitPrintOrder } from '../../lib/poster-studio/ui/order_client';
import { renderAndEncodePoster } from './posterExport';

export const PRINT_ORDER_URL = 'https://prints.dawarich.app/api/orders';

export function orderPageUrl(token) {
  return `${new URL(PRINT_ORDER_URL).origin}/orders/${token}`;
}

// Runs prepare + upload for the CURRENT studio layout (the dialog switches
// the layout to an orderable print size beforehand, mirroring the app's
// pickPrintSize, so the frame aspect and cssSize always match the PDF).
export async function runPrintOrder({ studio, previewRef, onPrepared, onProgress, signal }) {
  const layout = studio.layout;
  const product = printProductFor(layout.id);
  if (!product) throw new Error('This format is not orderable right now.');

  const map = previewRef.current?.getMap();
  const frame = previewRef.current?.getFrame();
  if (!map || !frame || !studio.style) throw new Error('The preview is not ready yet — try again.');

  const mapBounds = map.getBounds();
  const { blob } = await renderAndEncodePoster({
    style: studio.style,
    bounds: [
      [mapBounds.getWest(), mapBounds.getSouth()],
      [mapBounds.getEast(), mapBounds.getNorth()],
    ],
    layout,
    dpi: 300,
    format: 'pdf',
    theme: studio.theme,
    text: {
      title: studio.title.trim(),
      subtitle: studio.subtitle.trim(),
      coords: studio.showCoords ? formatCoords(map.getCenter()) : '',
      ...(studio.showAttribution ? {} : { attribution: '' }),
    },
    font: `"${fontByKey(studio.fontKey).family}", sans-serif`,
    cssSize: { width: frame.clientWidth, height: frame.clientHeight },
    signal,
  });
  onPrepared?.();

  return submitPrintOrder({
    url: PRINT_ORDER_URL,
    blob,
    sku: product.sku,
    title: studio.title.trim(),
    themeBase: studio.themeKey,
    layoutId: layout.id,
    onProgress,
  });
}
