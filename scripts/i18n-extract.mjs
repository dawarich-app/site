import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOCALE, LOCALES } from '../src/i18n/locales.js';

const ALLOWED_WARNING_PREFIXES = ['src/theme/ApiExplorer/'];
const FOOTER_FILE = 'docusaurus-theme-classic/footer.json';

export function warningFiles(output) {
  return [...output.matchAll(/Translation extraction warnings for file "([^"]+)"/g)].map((m) => m[1]);
}

export function unexpectedWarnings(files, allowed = ALLOWED_WARNING_PREFIXES) {
  return files.filter((file) => !allowed.some((prefix) => file.startsWith(prefix)));
}

export function stripCopyright(footer) {
  const { copyright, ...rest } = footer;
  return rest;
}

function writeTranslations(locale, extraArgs = []) {
  const result = spawnSync('npx', ['docusaurus', 'write-translations', '--locale', locale, ...extraArgs], {
    env: { ...process.env, DOCUSAURUS_CURRENT_LOCALE: locale },
    encoding: 'utf8',
  });
  const output = `${result.stdout}${result.stderr}`;
  if (result.status !== 0) throw new Error(`write-translations failed for ${locale}:\n${output}`);
  const unexpected = unexpectedWarnings(warningFiles(output));
  if (unexpected.length > 0) throw new Error(`non-static translations in ${locale}: ${unexpected.join(', ')}`);
}

function stripFooterCopyright(dir) {
  const file = path.join(dir, FOOTER_FILE);
  if (!fs.existsSync(file)) return;
  const data = stripCopyright(JSON.parse(fs.readFileSync(file, 'utf8')));
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function snapshotEnglish(i18nDir) {
  const englishDir = path.join(i18nDir, DEFAULT_LOCALE);
  const sourceDir = path.join(i18nDir, '.source', DEFAULT_LOCALE);
  writeTranslations(DEFAULT_LOCALE, ['--override']);
  fs.rmSync(sourceDir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(sourceDir), { recursive: true });
  fs.renameSync(englishDir, sourceDir);
  stripFooterCopyright(sourceDir);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const i18nDir = path.resolve('i18n');
  snapshotEnglish(i18nDir);
  for (const locale of LOCALES.filter((l) => l !== DEFAULT_LOCALE)) {
    writeTranslations(locale);
    stripFooterCopyright(path.join(i18nDir, locale));
    console.log(`i18n-extract: ${locale} up to date`);
  }
}
