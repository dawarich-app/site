import fs from 'node:fs';
import { expectedCtr } from '../src/utils/ctrCurve.mjs';

const [, , csvPath, minImpressionsArg] = process.argv;
if (!csvPath) {
  console.error('usage: node scripts/seo-ctr-report.mjs <pages-csv> [minImpressions]');
  process.exit(1);
}

const minImpressions = Number(minImpressionsArg ?? 5000);
if (!Number.isFinite(minImpressions) || minImpressions < 0) {
  console.error(`invalid minImpressions: ${minImpressionsArg}`);
  process.exit(1);
}

const parseLine = (line) => {
  const cells = [];
  let cur = '';
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') quoted = !quoted;
    else if (ch === ',' && !quoted) { cells.push(cur); cur = ''; }
    else cur += ch;
  }
  cells.push(cur);
  return cells;
};

const lines = fs.readFileSync(csvPath, 'utf8').replace(/^﻿/, '').trim().split('\n');
const hostRows = lines.slice(1)
  .map(parseLine)
  .filter((c) => c.length >= 5)
  .map(([url, clicks, impressions, , position]) => ({
    url,
    clicks: Number(clicks),
    impressions: Number(impressions),
    position: Number(position),
  }))
  .filter((r) => r.url.startsWith('https://dawarich.app/'));

for (const r of hostRows) {
  if (!Number.isFinite(r.position) || r.position <= 0) {
    throw new Error(`bad position "${r.position}" for ${r.url} — CSV column order may have changed`);
  }
  if (!Number.isInteger(r.impressions) || r.impressions < 0 || !Number.isInteger(r.clicks) || r.clicks < 0) {
    throw new Error(`bad clicks/impressions for ${r.url} — CSV column order may have changed`);
  }
}

const rows = hostRows.filter((r) => !r.url.includes('#') && r.impressions >= minImpressions);

if (rows.length === 0) {
  console.error(`no rows matched — ${hostRows.length} pages on dawarich.app, none with >= ${minImpressions} impressions`);
  process.exit(1);
}

const scored = rows.map((r) => {
  const par = expectedCtr(r.position);
  const ctr = r.impressions ? r.clicks / r.impressions : 0;
  return { ...r, ctr, par, ratio: par ? ctr / par : 0, recoverable: r.impressions * par - r.clicks };
}).sort((a, b) => b.recoverable - a.recoverable);

console.log('par = modeled expected CTR at that avg position (industry curve, not measured for this site); recover = modeled upper bound, not a forecast');
console.log('page'.padEnd(52) + 'impr'.padStart(9) + 'pos'.padStart(6) + 'CTR'.padStart(8) + 'par'.padStart(8) + 'ratio'.padStart(8) + 'recover'.padStart(10));
console.log('-'.repeat(101));
for (const r of scored.slice(0, 20)) {
  const path = r.url.replace(/^https?:\/\/[^/]+/, '');
  console.log(
    path.slice(0, 50).padEnd(52) +
    r.impressions.toLocaleString().padStart(9) +
    r.position.toFixed(1).padStart(6) +
    (r.ctr * 100).toFixed(2).padStart(7) + '%' +
    (r.par * 100).toFixed(2).padStart(7) + '%' +
    (r.ratio.toFixed(2) + 'x').padStart(8) +
    Math.round(r.recoverable).toLocaleString().padStart(10)
  );
}
