import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOCALE, LOCALES } from '../src/i18n/locales.js';
import { loadSources } from './i18n-status.mjs';

export const TITLE_MAX = 60;
export const DESCRIPTION_MAX = 160;

const sorted = (items) => [...items].sort();
const same = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));

const placeholders = (text) => [...new Set([...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]))];
const links = (text) => [...text.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((m) => m[1]);
const boldCount = (text) => [...text.matchAll(/\*\*[^*]+\*\*/g)].length;
const codeSpans = (text) => [...text.matchAll(/`([^`]+)`/g)].map((m) => m[1]);
const tags = (text) => [...text.matchAll(/<\/?([a-zA-Z][\w-]*)/g)].map((m) => m[0].toLowerCase());

function isPlural(text) {
  return text.includes('{count}') && text.split('|').length === 2;
}

export function pluralFormRange(locale) {
  const rules = new Intl.PluralRules(locale);
  const used = new Set();
  for (let n = 0; n <= 200; n += 1) used.add(rules.select(n));
  return { min: used.size, max: rules.resolvedOptions().pluralCategories.length };
}

function lengthLimit(key, english) {
  if (key.endsWith('meta.title')) return Math.max(TITLE_MAX, english.length);
  if (key.endsWith('meta.description')) return Math.max(DESCRIPTION_MAX, english.length);
  return Infinity;
}

export function validateTranslations({ english, localized, locale, glossary }) {
  const errors = [];
  const fail = (key, rule) => errors.push({ key, rule });
  for (const [key, translation] of Object.entries(localized)) {
    const source = english[key];
    if (source === undefined) continue;
    if (translation.trim() === '') {
      fail(key, 'empty');
      continue;
    }
    if (!same(placeholders(source), placeholders(translation))) fail(key, 'placeholders');
    if (!same(links(source), links(translation))) fail(key, 'links');
    if (isPlural(source)) {
      const perForm = boldCount(source.split('|')[0]);
      if (translation.split('|').some((form) => boldCount(form) !== perForm)) fail(key, 'bold');
    } else if (boldCount(source) !== boldCount(translation)) {
      fail(key, 'bold');
    }
    if (!same(tags(source), tags(translation))) fail(key, 'tags');
    if (!same(codeSpans(source), codeSpans(translation))) fail(key, 'code');
    const spaced = translation.replace(/-/g, ' ');
    if (glossary.doNotTranslate.some((term) => source.includes(term) && !spaced.includes(term.replace(/-/g, ' ')))) {
      fail(key, 'glossary');
    }
    if (translation.length > lengthLimit(key, source)) fail(key, 'length');
    if (isPlural(source)) {
      const { min, max } = pluralFormRange(locale);
      const forms = translation.split('|').length;
      if (forms < min || forms > max) fail(key, 'plural');
    }
  }
  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const localeArg = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1];
  const locales = localeArg ? [localeArg] : LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  const glossary = JSON.parse(fs.readFileSync(path.join(root, 'i18n/glossary.json'), 'utf8'));
  let total = 0;
  for (const locale of locales) {
    const { english, localized } = loadSources({ root, locale });
    const errors = validateTranslations({ english, localized, locale, glossary });
    total += errors.length;
    console.log(`${locale.padEnd(6)} ${errors.length} problem(s)`);
    for (const { key, rule } of errors) console.log(`  ${rule.padEnd(12)} ${key}`);
  }
  process.exit(total > 0 ? 1 : 0);
}
