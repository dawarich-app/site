import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeStatus, flattenContent, summarize } from './i18n-lib.mjs';
import { DEFAULT_LOCALE, LOCALES } from '../src/i18n/locales.js';

export const TIER1_FILES = {
  code: 'code.json',
  navbar: 'docusaurus-theme-classic/navbar.json',
  footer: 'docusaurus-theme-classic/footer.json',
};

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

function messages(file) {
  const data = readJson(file, null);
  if (!data) return null;
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value.message]));
}

function listJson(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listJson(full, base);
    return entry.name.endsWith('.json') ? [path.relative(base, full)] : [];
  });
}

function prefixed(prefix, map) {
  return Object.fromEntries(Object.entries(map).map(([key, value]) => [`${prefix}:${key}`, value]));
}

export function loadSources({ root, locale }) {
  const english = {};
  const localized = {};
  for (const [name, file] of Object.entries(TIER1_FILES)) {
    const source = messages(path.join(root, 'i18n/.source/en', file)) ?? {};
    const target = messages(path.join(root, 'i18n', locale, file));
    const keys = target ? Object.keys(target) : Object.keys(source);
    Object.assign(english, prefixed(name, Object.fromEntries(keys.filter((k) => k in source).map((k) => [k, source[k]]))));
    if (target) Object.assign(localized, prefixed(name, target));
  }
  const contentRoot = path.join(root, 'src/i18n/content');
  for (const file of listJson(path.join(contentRoot, DEFAULT_LOCALE))) {
    const source = flattenContent(readJson(path.join(contentRoot, DEFAULT_LOCALE, file)));
    const target = flattenContent(readJson(path.join(contentRoot, locale, file), {}));
    Object.assign(english, prefixed(`content:${file}`, source));
    Object.assign(localized, prefixed(`content:${file}`, target));
  }
  return { english, localized };
}

export function makeAllowIdentical(doNotTranslate) {
  const terms = [...doNotTranslate].sort((a, b) => b.length - a.length);
  return (text) => {
    let rest = text;
    for (const term of terms) rest = rest.split(term).join(' ');
    return !/\p{L}{2,}/u.test(rest.replace(/\{\w+\}/g, ' '));
  };
}

export function collectLocaleStatus({ root, locale }) {
  const { english, localized } = loadSources({ root, locale });
  const glossary = readJson(path.join(root, 'i18n/glossary.json'), { doNotTranslate: [] });
  const hashes = readJson(path.join(root, 'i18n/source-hashes.json'), {})[locale] ?? {};
  return computeStatus({ english, localized, hashes, allowIdentical: makeAllowIdentical(glossary.doNotTranslate) });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const strict = args.includes('--strict');
  const verbose = args.includes('--verbose');
  const localeArg = args.find((a) => a.startsWith('--locale='))?.split('=')[1];
  const locales = localeArg ? [localeArg] : LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  let blockingTotal = 0;
  for (const locale of locales) {
    const status = collectLocaleStatus({ root: process.cwd(), locale });
    const { counts, blocking } = summarize(status);
    blockingTotal += blocking.length;
    console.log(`${locale.padEnd(6)} ${Object.entries(counts).map(([k, v]) => `${k}=${v}`).join(' ')}`);
    if (verbose) for (const key of blocking) console.log(`  ${status[key].padEnd(12)} ${key}`);
  }
  if (strict && blockingTotal > 0) process.exit(1);
}
