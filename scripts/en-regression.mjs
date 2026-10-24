import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ENTITIES = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&nbsp;': ' ' };

function decode(text) {
  return text.replace(/&(amp|lt|gt|quot|#x27|#39|nbsp);/g, (entity) => ENTITIES[entity]);
}

function squash(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function normalizeUrls(text) {
  return text.replace(/(https:\/\/dawarich\.app[^"'\s]*?)\/(?=["'\s]|$)/g, '$1');
}

export function extractComparable(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '';
  const description = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1] ?? '';
  const mainHtml = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? '';
  const main = mainHtml
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
  const jsonld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  return {
    title: squash(decode(title)),
    description: squash(decode(description)),
    main: squash(decode(main)).replace(/ ([.,:;!?)])/g, '$1'),
    jsonld: jsonld.map((block) => squash(block)),
  };
}

export function comparePages(baselineHtml, branchHtml) {
  const before = extractComparable(baselineHtml);
  const after = extractComparable(branchHtml);
  const diffs = [];
  for (const field of ['title', 'description', 'main']) {
    if (before[field] !== after[field]) diffs.push({ field, before: before[field], after: after[field] });
  }
  const beforeLd = before.jsonld.map(normalizeUrls).sort();
  const afterLd = after.jsonld.map(normalizeUrls).sort();
  if (JSON.stringify(beforeLd) !== JSON.stringify(afterLd)) {
    diffs.push({ field: 'jsonld', before: beforeLd, after: afterLd });
  }
  return diffs;
}

function firstDifference(a, b) {
  let i = 0;
  while (i < a.length && a[i] === b[i]) i += 1;
  return `…${a.slice(Math.max(0, i - 60), i + 80)}…\n    vs …${b.slice(Math.max(0, i - 60), i + 80)}…`;
}

function routeFile(dir, route) {
  return path.join(dir, route.replace(/^\//, ''), 'index.html');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const baselineDir = process.env.EN_BASELINE ?? path.resolve('../site-i18n-baseline-build');
  const routes = process.argv.slice(2);
  let failed = 0;
  for (const route of routes) {
    const diffs = comparePages(
      fs.readFileSync(routeFile(baselineDir, route), 'utf8'),
      fs.readFileSync(routeFile('build', route), 'utf8'),
    );
    if (diffs.length === 0) {
      console.log(`ok   ${route}`);
      continue;
    }
    failed += 1;
    console.log(`DIFF ${route}`);
    for (const d of diffs) {
      const detail = typeof d.before === 'string' ? firstDifference(d.before, d.after) : JSON.stringify(d.after).slice(0, 300);
      console.log(`  ${d.field}: ${detail}`);
    }
  }
  process.exit(failed ? 1 : 0);
}
