#!/usr/bin/env node
// Inject <meta name="robots" content="noindex,follow"> into every built /docs/api/*
// HTML file EXCEPT the entry page (/docs/api/dawarich-api/), which should remain
// indexable as the canonical "Dawarich API" landing.
//
// Why a postBuild script: docs/api/*.md files are auto-regenerated on every build
// by `docusaurus gen-api-docs`, so per-file frontmatter overrides get blown away.
// Editing the built HTML is the most resilient injection point.

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BUILD_DIR = new URL('../build/docs/api/', import.meta.url).pathname;
const KEEP_INDEXABLE = new Set(['dawarich-api']); // page slug(s) to leave untouched
const META_TAG = '<meta name="robots" content="noindex,follow"/>';

async function listSubdirs(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries.filter(e => e.isDirectory()).map(e => e.name);
}

async function injectNoindex(htmlPath) {
  const html = await readFile(htmlPath, 'utf8');
  if (html.includes('content="noindex,follow"')) return false; // idempotent
  const updated = html.replace('</head>', `${META_TAG}</head>`);
  if (updated === html) return false;
  await writeFile(htmlPath, updated);
  return true;
}

async function main() {
  let touched = 0;
  let skipped = 0;
  const slugs = await listSubdirs(BUILD_DIR);
  for (const slug of slugs) {
    if (KEEP_INDEXABLE.has(slug)) {
      skipped++;
      continue;
    }
    const htmlPath = join(BUILD_DIR, slug, 'index.html');
    try {
      if (await injectNoindex(htmlPath)) touched++;
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
  }
  console.log(`[noindex-api] noindexed ${touched} pages under /docs/api/, kept ${skipped} indexable`);
}

main().catch(err => {
  console.error('[noindex-api] failed:', err);
  process.exit(1);
});
