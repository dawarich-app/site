import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOCALE, LOCALES } from '../src/i18n/locales.js';

export const ROOT_ONLY_STATIC_FILES = [
  'robots.txt',
  '_headers',
  '_redirects',
  'CNAME',
  'llms.txt',
  'llms-full.txt',
  'pricing.md',
  'features.md',
  'sw.js',
  'brevo-frame.html',
];

export function pruneLocaleStatic(buildDir, locales = LOCALES) {
  const removed = [];
  for (const locale of locales) {
    if (locale === DEFAULT_LOCALE) continue;
    const localeDir = path.join(buildDir, locale);
    if (!fs.existsSync(localeDir)) continue;
    for (const file of ROOT_ONLY_STATIC_FILES) {
      const target = path.join(localeDir, file);
      if (fs.existsSync(target)) {
        fs.rmSync(target);
        removed.push(target);
      }
    }
  }
  return removed;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const buildDir = path.resolve(process.argv[2] ?? 'build');
  const removed = pruneLocaleStatic(buildDir);
  console.log(`prune-locale-static: removed ${removed.length} root-only files from locale dirs`);
}
