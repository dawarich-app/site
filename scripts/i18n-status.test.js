import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { collectLocaleStatus } from './i18n-status.mjs';
import { hashMessage } from './i18n-lib.mjs';

function write(root, file, data) {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, JSON.stringify(data));
}

describe('collectLocaleStatus', () => {
  let root;

  beforeEach(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'i18n-status-'));
    write(root, 'i18n/.source/en/code.json', {
      'shared.save': { message: 'Save' },
      'shared.gpx': { message: 'GPX' },
    });
    write(root, 'i18n/.source/en/docusaurus-theme-classic/navbar.json', { 'item.label.Pricing': { message: 'Pricing' } });
    write(root, 'i18n/de/code.json', {
      'shared.save': { message: 'Speichern' },
      'shared.gpx': { message: 'GPX' },
    });
    write(root, 'i18n/de/docusaurus-theme-classic/navbar.json', { 'item.label.Pricing': { message: 'Pricing' } });
    write(root, 'src/i18n/content/en/tools/x.json', { h1: 'Converter', faq: [{ q: 'Why?' }] });
    write(root, 'src/i18n/content/de/tools/x.json', { h1: 'Konverter' });
    write(root, 'i18n/glossary.json', { doNotTranslate: ['GPX'] });
    fs.mkdirSync(path.join(root, 'src/pages'), { recursive: true });
    fs.writeFileSync(path.join(root, 'src/pages/contact.md'), '# Contact\n');
    fs.mkdirSync(path.join(root, 'i18n/de/docusaurus-plugin-content-pages'), { recursive: true });
    fs.writeFileSync(path.join(root, 'i18n/de/docusaurus-plugin-content-pages/contact.md'), '# Kontakt\n');
    write(root, 'i18n/source-hashes.json', { de: { 'content:tools/x.json:h1': hashMessage('Old converter') } });
  });

  afterEach(() => fs.rmSync(root, { recursive: true, force: true }));

  it('should report tier-1 and tier-2 statuses for a locale', () => {
    expect(collectLocaleStatus({ root, locale: 'de' })).toEqual({
      'code:shared.save': 'ok',
      'code:shared.gpx': 'ok',
      'navbar:item.label.Pricing': 'untranslated',
      'content:tools/x.json:h1': 'stale',
      'content:tools/x.json:faq.0.q': 'missing',
      'page:contact.md': 'ok',
    });
  });

  it('should report every content key missing when a locale has no content files', () => {
    const status = collectLocaleStatus({ root, locale: 'fr' });
    expect(status['content:tools/x.json:h1']).toBe('missing');
    expect(status['page:contact.md']).toBe('missing');
  });
});
