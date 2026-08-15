#!/usr/bin/env node
// Diffs every vendored poster-studio module against its Rails source,
// ignoring import lines, provenance headers, whitespace, and the intentional
// deltas declared in poster-drift-manifest.json. Exit 1 on real drift.
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareModules } from '../src/utils/posterDrift.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const appRoot = process.env.DAWARICH_APP_DIR
  ? resolve(process.env.DAWARICH_APP_DIR)
  : join(homedir(), 'projects/dawarich/dawarich');

const manifest = JSON.parse(
  readFileSync(join(here, 'poster-drift-manifest.json'), 'utf8'),
);

if (!existsSync(appRoot)) {
  console.warn(
    `⚠ Rails checkout not found at ${appRoot} — drift check skipped. ` +
      'Set DAWARICH_APP_DIR to point at a dawarich checkout to enable it.',
  );
  process.exit(0);
}

const drifted = [];

for (const [vendoredPath, entry] of Object.entries(manifest.modules)) {
  const sourceFile = join(appRoot, entry.source);
  const source = readFileSync(sourceFile, 'utf8');

  if (entry.manual) {
    const missing = entry.requiredSymbols.filter((symbol) => !source.includes(symbol));
    if (missing.length) {
      drifted.push(vendoredPath);
      console.error(
        `✗ ${vendoredPath}: symbols missing from ${entry.source}: ${missing.join(', ')} — re-extract manually`,
      );
    } else {
      console.log(`✓ ${vendoredPath} clean (manual extract, source symbols present)`);
    }
    continue;
  }

  const vendored = readFileSync(
    join(siteRoot, 'src/lib/poster-studio', vendoredPath),
    'utf8',
  );
  const result = compareModules(vendored, source, entry.deltaPatterns ?? []);
  if (result.clean) {
    console.log(`✓ ${vendoredPath} clean`);
  } else {
    drifted.push(vendoredPath);
    console.error(
      `✗ ${vendoredPath} DRIFTED at normalized line ${result.firstDiff.line}\n` +
        `    vendored: ${result.firstDiff.vendored}\n` +
        `    source:   ${result.firstDiff.source}`,
    );
  }
}

console.log(
  '\nBlind spot: display prices in data/print_products.js can only drift against ' +
    'the Stripe server config, which no script can see — reconcile the 3 SKUs ' +
    'against live Stripe prices on the launch checklist.',
);

if (drifted.length) {
  console.error(`\n${drifted.length} file(s) drifted: ${drifted.join(', ')}`);
  process.exit(1);
}
console.log('All vendored modules clean.');
