import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { addJsonLdLanguage } from './add-json-ld-language.mjs';

const ld = (data) => `<script data-rh="true" type="application/ld+json">${JSON.stringify(data)}</script>`;
const page = (lang, blocks, robots = '') =>
  `<!doctype html><html lang="${lang}" dir="ltr"><head>${robots}${blocks.join('')}</head><body><main>x</main></body></html>`;
const blocksOf = (file) =>
  [...fs.readFileSync(file, 'utf8').matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));

describe('addJsonLdLanguage', () => {
  let dir;
  const file = (rel) => path.join(dir, rel);

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ldlang-'));
    fs.mkdirSync(file('de/tools/x'), { recursive: true });
    fs.mkdirSync(file('de/roadmap'), { recursive: true });
    fs.writeFileSync(file('de/tools/x/index.html'), page('de', [
      ld({ '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Konverter </b>' }),
      ld({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [] }),
      ld({ '@context': 'https://schema.org', '@graph': [{ '@type': 'FAQPage' }, { '@type': 'Organization' }] }),
    ]));
    fs.writeFileSync(file('de/roadmap/index.html'), page('de', [ld({ '@type': 'WebPage' })], '<meta name="robots" content="noindex, follow">'));
    fs.writeFileSync(file('index.html'), page('zh-Hans', [ld({ '@type': 'WebSite', inLanguage: 'en' })]));
  });

  afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

  it('should add the page language to creative-work types only', () => {
    expect(addJsonLdLanguage(dir)).toBe(1);
    const [app, crumbs, graph] = blocksOf(file('de/tools/x/index.html'));
    expect(app.inLanguage).toBe('de');
    expect(app.name).toBe('Konverter </b>');
    expect(crumbs.inLanguage).toBeUndefined();
    expect(graph['@graph'][0].inLanguage).toBe('de');
    expect(graph['@graph'][1].inLanguage).toBeUndefined();
  });

  it('should keep the script safe from an early closing tag', () => {
    addJsonLdLanguage(dir);
    expect(fs.readFileSync(file('de/tools/x/index.html'), 'utf8')).not.toContain('Konverter </b>');
  });

  it('should skip noindex pages and keep an existing inLanguage', () => {
    addJsonLdLanguage(dir);
    expect(blocksOf(file('de/roadmap/index.html'))[0].inLanguage).toBeUndefined();
    expect(blocksOf(file('index.html'))[0].inLanguage).toBe('en');
  });
});
