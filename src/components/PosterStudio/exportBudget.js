// Canvas-AREA safety budget. detectMaxRenderDimension() in the vendored
// paper_sizes.js caps only the longest SIDE; iOS/WebKit additionally enforces
// a total-area ceiling far below 16384² and silently returns a BLANK canvas
// above it. We clamp the requested DPI so the area stays inside the budget,
// and sanity-check rendered pixels before delivering or uploading anything.
import { MM_PER_INCH, PAPER_SIZES } from '../../lib/poster-studio/data/paper_sizes';

export const DESKTOP_AREA_BUDGET_PX = 268_000_000;
export const IOS_AREA_BUDGET_PX = 16_700_000;

export function isAppleMobileDevice(nav) {
  const userAgent = nav?.userAgent || '';
  if (/iPhone|iPad|iPod/.test(userAgent)) return true;
  // iPadOS 13+ reports itself as Macintosh; touch points give it away.
  return /Macintosh/.test(userAgent) && (nav?.maxTouchPoints || 0) > 1;
}

export function detectAreaBudget(nav = typeof navigator === 'undefined' ? {} : navigator) {
  return isAppleMobileDevice(nav) ? IOS_AREA_BUDGET_PX : DESKTOP_AREA_BUDGET_PX;
}

// Largest DPI whose full export area fits the budget. Pixel layouts pass
// through untouched: the biggest (wallpaper-tablet, 5.7 MP) sits far below
// even the iOS budget, and their geometry is fixed anyway.
export function clampDpiForBudget(layout, dpi, maxAreaPx) {
  if (layout.kind !== 'paper') return { dpi, areaClamped: false };

  const paper = PAPER_SIZES[layout.paperKey];
  const areaAt = (candidate) =>
    Math.round((paper.wmm / MM_PER_INCH) * candidate) *
    Math.round((paper.hmm / MM_PER_INCH) * candidate);

  if (areaAt(dpi) <= maxAreaPx) return { dpi, areaClamped: false };

  let budgetDpi = Math.floor(
    Math.sqrt((maxAreaPx * MM_PER_INCH * MM_PER_INCH) / (paper.wmm * paper.hmm)),
  );
  while (budgetDpi > 1 && areaAt(budgetDpi) > maxAreaPx) budgetDpi -= 1;
  return { dpi: Math.max(1, budgetDpi), areaClamped: true };
}

// Samples a grid of pixels; a render whose every sample is identical is
// overwhelmingly a silently-blanked canvas (real posters carry map texture).
export function isCanvasBlank(canvas, { grid = 5 } = {}) {
  const context = canvas.getContext && canvas.getContext('2d');
  if (!context) return true;

  let first = null;
  for (let i = 0; i < grid; i += 1) {
    for (let j = 0; j < grid; j += 1) {
      const x = Math.min(canvas.width - 1, Math.floor((canvas.width * (i + 0.5)) / grid));
      const y = Math.min(canvas.height - 1, Math.floor((canvas.height * (j + 0.5)) / grid));
      const { data } = context.getImageData(x, y, 1, 1);
      const pixel = `${data[0]},${data[1]},${data[2]},${data[3]}`;
      if (first === null) first = pixel;
      else if (pixel !== first) return false;
    }
  }
  return true;
}
