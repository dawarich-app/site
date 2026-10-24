import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOCALE, LOCALES } from '../src/i18n/locales.js';
import { computeStatus, hashMessage, summarize } from './i18n-lib.mjs';
import { TIER1_FILES, loadSources, makeAllowIdentical } from './i18n-status.mjs';
import { validateTranslations } from './i18n-validate.mjs';

function target(key, locale) {
  if (key.startsWith('content:')) {
    const [, file, leaf] = key.match(/^content:([^:]+):(.+)$/);
    return { file: `src/i18n/content/${locale}/${file}`, path: leaf };
  }
  if (key.startsWith('page:')) {
    return { file: `i18n/${locale}/docusaurus-plugin-content-pages/${key.slice('page:'.length)}`, path: '' };
  }
  const [, tier, leaf] = key.match(/^(\w+):(.+)$/);
  return { file: `i18n/${locale}/${TIER1_FILES[tier]}`, path: leaf };
}

export function buildTodo({ english, status, locale }) {
  return summarize(status).blocking.map((key) => ({
    key,
    status: status[key],
    english: english[key],
    ...target(key, locale),
  }));
}

export function recordHashes({ english, localized, errors, previous = {}, identicalOk = [], todoKeys = [] }) {
  const invalid = new Set(errors.map((e) => e.key));
  const intentional = new Set(identicalOk);
  const handedOut = new Set(todoKeys);
  const hashes = { ...previous };
  for (const key of Object.keys(localized)) {
    if (english[key] === undefined || invalid.has(key)) continue;
    if (localized[key] === english[key] && !intentional.has(key)) continue;
    if (key in previous && !handedOut.has(key)) continue;
    hashes[key] = hashMessage(english[key]);
  }
  return hashes;
}

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.cwd();
  const mode = process.argv[2];
  const localeArg = process.argv.find((a) => a.startsWith('--locale='))?.split('=')[1];
  const locales = localeArg ? [localeArg] : LOCALES.filter((l) => l !== DEFAULT_LOCALE);
  const glossary = readJson(path.join(root, 'i18n/glossary.json'), { doNotTranslate: [] });
  const hashesFile = path.join(root, 'i18n/source-hashes.json');
  const allHashes = readJson(hashesFile, {});
  for (const locale of locales) {
    const { english, localized } = loadSources({ root, locale });
    if (mode === 'record') {
      const errors = validateTranslations({ english, localized, locale, glossary });
      const identicalOk = readJson(path.join(root, 'i18n', locale, 'identical.json'), []);
      const todoKeys = readJson(path.join(root, 'i18n/todo', `${locale}.json`), []).map((item) => item.key);
      allHashes[locale] = recordHashes({ english, localized, errors, previous: allHashes[locale], identicalOk, todoKeys });
      console.log(`${locale}: recorded ${Object.keys(allHashes[locale]).length} hashes (${errors.length} invalid skipped)`);
    } else {
      const status = computeStatus({
        english,
        localized,
        hashes: allHashes[locale] ?? {},
        allowIdentical: makeAllowIdentical(glossary.doNotTranslate),
      });
      const todo = buildTodo({ english, status, locale });
      const out = path.join(root, 'i18n/todo', `${locale}.json`);
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, `${JSON.stringify(todo, null, 2)}\n`);
      console.log(`${locale}: ${todo.length} items → ${path.relative(root, out)}`);
    }
  }
  if (mode === 'record') fs.writeFileSync(hashesFile, `${JSON.stringify(allHashes, null, 2)}\n`);
}
