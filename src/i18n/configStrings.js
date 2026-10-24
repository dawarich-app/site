import fs from 'node:fs';
import path from 'node:path';
import { DEFAULT_LOCALE } from './locales.js';

const CONTENT_DIR = path.resolve(process.cwd(), 'src/i18n/content');

function load(locale) {
  const file = path.join(CONTENT_DIR, locale, 'shared/config.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

const HTML_ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
}

export function configString(locale, key, values = {}) {
  const message = load(locale)[key] ?? load(DEFAULT_LOCALE)[key];
  if (message === undefined) throw new Error(`Missing config string "${key}" in src/i18n/content/${DEFAULT_LOCALE}/shared/config.json`);
  return message.replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));
}
