// Hex → rgba() strings for the line-gradient stops. Malformed input falls
// back to the Dawarich brand blue rather than crashing a render.
export const DAWARICH_BLUE = '#2563EB';

const FALLBACK_RGB = [37, 99, 235];

export function hexToRgba(hex, alpha) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex || '');
  const [r, g, b] = match
    ? [0, 2, 4].map((i) => Number.parseInt(match[1].slice(i, i + 2), 16))
    : FALLBACK_RGB;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
