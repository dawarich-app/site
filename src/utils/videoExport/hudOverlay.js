// Replay HUD, implementing the "Replay Frames" design: broadcast chrome in
// the top and bottom safe bands (map clear in the middle third), a progress
// timeline with the playhead's recorded date, and a summary frame that fades
// in for the final hold. All sizes derive from the design's 620px reference
// frame via u = min(width, height) / 100 (design px ÷ 6.2).
import { hexToRgba } from './colorUtil';
import {
  dayNumber,
  dayTotal,
  formatClockDate,
  formatDateRange,
  formatShortDate,
  splitDistance,
} from './hudFormat';
import { timeAtFraction } from './routeClock';

const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const SANS = 'Archivo, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, sans-serif';
const INK = (a) => `rgba(255, 255, 255, ${a})`;

function text(ctx, str, x, y, { font, color, ls = 0, align = 'left', baseline = 'alphabetic' }) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = baseline;
  try {
    ctx.letterSpacing = `${ls}px`;
  } catch {
    // Older engines without canvas letterSpacing render slightly tighter.
  }
  ctx.fillText(str, x, y);
  try {
    ctx.letterSpacing = '0px';
  } catch {
    // Same fallback as above.
  }
}

function scrim(ctx, width, height, stops, alpha) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  for (const [at, a] of stops) gradient.addColorStop(at, `rgba(6, 6, 8, ${a})`);
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function replayChrome(ctx, opts) {
  const { width, height, u, fraction, distanceM, units, accent, clock, playheadTs } = opts;
  const inset = u * 3.9;

  if (clock && playheadTs != null) {
    text(ctx, formatClockDate(playheadTs), inset, inset, {
      font: `400 ${u * 1.77}px ${MONO}`,
      color: INK(0.5),
      ls: u * 1.77 * 0.18,
      baseline: 'top',
    });
    const day = String(dayNumber(clock.startTs, playheadTs)).padStart(2, '0');
    const total = String(dayTotal(clock.startTs, clock.endTs)).padStart(2, '0');
    text(ctx, `DAY ${day} / ${total}`, inset, inset + u * 2.6, {
      font: `400 ${u * 1.77}px ${MONO}`,
      color: INK(0.34),
      ls: u * 1.77 * 0.1,
      baseline: 'top',
    });
  }

  const datesBase = height - inset;
  const trackY = datesBase - u * 1.6 - u * 1.6 - u * 0.48;
  const numBase = trackY - u * 2.6;

  const dateFont = `400 ${u * 1.6}px ${MONO}`;
  if (clock) {
    text(ctx, formatShortDate(clock.startTs), inset, datesBase, {
      font: dateFont,
      color: INK(0.34),
      ls: u * 1.6 * 0.12,
    });
    text(ctx, formatShortDate(clock.endTs), width - inset, datesBase, {
      font: dateFont,
      color: INK(0.34),
      ls: u * 1.6 * 0.12,
      align: 'right',
    });
  }
  text(ctx, 'https://dawarich.app', width / 2, datesBase, {
    font: dateFont,
    color: INK(0.5),
    ls: u * 1.6 * 0.12,
    align: 'center',
  });

  const trackW = width - inset * 2;
  ctx.fillStyle = INK(0.14);
  roundedRect(ctx, inset, trackY, trackW, u * 0.48, u * 0.24);
  ctx.fill();
  if (fraction > 0) {
    ctx.fillStyle = accent;
    roundedRect(ctx, inset, trackY, Math.max(u * 0.48, trackW * fraction), u * 0.48, u * 0.24);
    ctx.fill();
  }
  const headX = inset + trackW * fraction;
  const headY = trackY + u * 0.24;
  ctx.fillStyle = hexToRgba(accent, 0.35);
  ctx.beginPath();
  ctx.arc(headX, headY, u * 0.72 + u * 0.48, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(headX, headY, u * 0.72, 0, Math.PI * 2);
  ctx.fill();

  text(ctx, 'DISTANCE', inset, numBase - u * 9.2, {
    font: `400 ${u * 1.6}px ${MONO}`,
    color: INK(0.42),
    ls: u * 1.6 * 0.2,
  });
  const distance = splitDistance(distanceM, units);
  text(ctx, distance.value, inset, numBase, {
    font: `700 ${u * 8.7}px ${MONO}`,
    color: '#fff',
    ls: -(u * 8.7 * 0.02),
  });
  ctx.font = `700 ${u * 8.7}px ${MONO}`;
  const numW = ctx.measureText(distance.value).width;
  text(ctx, distance.unit, inset + numW + u * 1.1, numBase, {
    font: `500 ${u * 2.9}px ${SANS}`,
    color: INK(0.55),
  });

  const valueBase = numBase - u * 1;
  const labelBase = valueBase - u * 3.2;

  text(ctx, 'OF TOTAL', width - inset, labelBase, {
    font: `400 ${u * 1.45}px ${MONO}`,
    color: INK(0.36),
    ls: u * 1.45 * 0.18,
    align: 'right',
  });
  text(ctx, `${Math.round(fraction * 100)}%`, width - inset, valueBase, {
    font: `500 ${u * 2.74}px ${MONO}`,
    color: accent,
    align: 'right',
  });
}

function summaryFrame(ctx, opts) {
  const { width, height, u, stats, units, accent, clock } = opts;
  const inset = u * 4.8;

  const footerBase = height - inset;
  const dividerY = footerBase - u * 2.6 - u * 3.55;
  const sublineBase = clock ? dividerY - u * 3.55 : dividerY - u * 2.4;
  const numBase = clock ? sublineBase - u * 5.2 : sublineBase;

  const distance = splitDistance(stats?.distanceM ?? 0, units);
  if (clock) {
    text(ctx, formatDateRange(clock.startTs, clock.endTs), inset, numBase - u * 13.4, {
      font: `400 ${u * 1.77}px ${MONO}`,
      color: accent,
      ls: u * 1.77 * 0.22,
    });
  }
  text(ctx, distance.value, inset, numBase, {
    font: `700 ${u * 14.2}px ${MONO}`,
    color: '#fff',
    ls: -(u * 14.2 * 0.03),
  });
  ctx.font = `700 ${u * 14.2}px ${MONO}`;
  const numW = ctx.measureText(distance.value).width;
  text(ctx, distance.unit, inset + numW + u * 1.6, numBase, {
    font: `500 ${u * 4.84}px ${SANS}`,
    color: INK(0.6),
  });
  if (clock) {
    text(ctx, `travelled over ${dayTotal(clock.startTs, clock.endTs)} days`, inset, sublineBase, {
      font: `500 ${u * 2.74}px ${SANS}`,
      color: INK(0.62),
    });
  }

  ctx.fillStyle = INK(0.13);
  ctx.fillRect(inset, dividerY, width - inset * 2, 1);

  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(inset + u * 0.72, footerBase - u * 0.8, u * 0.72, 0, Math.PI * 2);
  ctx.fill();
  text(ctx, 'https://dawarich.app', inset + u * 2.9, footerBase, {
    font: `500 ${u * 2.26}px ${SANS}`,
    color: INK(0.72),
  });
  text(ctx, 'PRIVATE LOCATION HISTORY', width - inset, footerBase, {
    font: `400 ${u * 1.77}px ${MONO}`,
    color: INK(0.34),
    ls: u * 1.77 * 0.14,
    align: 'right',
  });
}

export function drawHud(ctx, options) {
  const { width, height, fraction, outroProgress, clock } = options;
  const u = Math.min(width, height) / 100;
  const playheadTs = clock ? timeAtFraction(clock, fraction) : null;
  const opts = { ...options, u, playheadTs };

  if (outroProgress < 1) {
    scrim(ctx, width, height, [[0, 0.72], [0.26, 0], [0.52, 0], [1, 0.86]], 1 - outroProgress);
  }
  if (outroProgress > 0) {
    scrim(ctx, width, height, [[0, 0.55], [0.3, 0.25], [0.74, 0.9], [1, 0.97]], outroProgress);
  }

  ctx.save();
  if (outroProgress < 1) {
    ctx.globalAlpha = 1 - outroProgress;
    replayChrome(ctx, opts);
  }
  ctx.restore();

  ctx.save();
  if (outroProgress > 0) {
    ctx.globalAlpha = outroProgress;
    summaryFrame(ctx, opts);
  }
  ctx.restore();
}
