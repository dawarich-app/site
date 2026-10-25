import { describe, it, expect } from 'vitest';
import {
  checkLocalizedPage,
  checkNonLocalizedPage,
  checkEnglishOnlyPage,
  checkSitemap,
  findLocaleDocsLinks,
  findGlobalOgUrl,
  readPage,
} from './check-i18n-build.mjs';

const LOCALES = ['en', 'de', 'pt-br'];
const HTML_LANG = { en: 'en', de: 'de', 'pt-br': 'pt-BR' };

function page({
  lang = 'de',
  canonical = ['https://dawarich.app/de/tools/x/'],
  alternates = { en: '/tools/x/', de: '/de/tools/x/', 'pt-BR': '/pt-br/tools/x/', 'x-default': '/tools/x/' },
  ogUrl = 'https://dawarich.app/de/tools/x/',
  title = 'Konverter',
  jsonld = { '@type': 'WebApplication', url: 'https://dawarich.app/de/tools/x/' },
  robots = null,
} = {}) {
  return [
    `<html lang="${lang}"><head><title data-rh="true">${title} | Dawarich</title>`,
    ...canonical.map((href) => `<link data-rh="true" rel="canonical" href="${href}">`),
    ...Object.entries(alternates).map(
      ([hl, path]) => `<link data-rh="true" rel="alternate" href="https://dawarich.app${path}" hreflang="${hl}">`,
    ),
    `<meta data-rh="true" property="og:url" content="${ogUrl}">`,
    robots ? `<meta data-rh="true" name="robots" content="${robots}">` : '',
    `<script data-rh="true" type="application/ld+json">${JSON.stringify(jsonld)}</script>`,
    '</head><body><main>x</main></body></html>',
  ].join('');
}

const exists = () => true;
const ctx = { route: '/tools/x/', locale: 'de', locales: LOCALES, htmlLang: HTML_LANG, englishTitle: 'Converter', englishMain: 'English body', exists };

describe('checkLocalizedPage', () => {
  it('should pass a correctly localized page', () => {
    expect(checkLocalizedPage(page(), ctx)).toEqual([]);
  });

  it('should report each SEO defect', () => {
    expect(checkLocalizedPage(page({ lang: 'en' }), ctx)).toEqual(['html lang en != de']);
    expect(checkLocalizedPage(page({ canonical: ['https://dawarich.app/tools/x/'] }), ctx)).toEqual([
      'canonical https://dawarich.app/tools/x/ != https://dawarich.app/de/tools/x/',
    ]);
    expect(checkLocalizedPage(page({ canonical: ['https://dawarich.app/de/tools/x/', 'https://dawarich.app/de/tools/x/'] }), ctx)).toEqual([
      'expected 1 canonical, found 2',
    ]);
    expect(checkLocalizedPage(page({ alternates: { en: '/tools/x/' } }), ctx)).toEqual([
      'hreflang set en != de,en,pt-BR,x-default',
    ]);
    expect(checkLocalizedPage(page({ ogUrl: 'https://dawarich.app/tools/x/' }), ctx)).toEqual([
      'og:url https://dawarich.app/tools/x/ != canonical',
    ]);
    expect(checkLocalizedPage(page({ title: 'Converter' }), { ...ctx, englishMain: 'x' })).toEqual(['page not translated']);
    expect(checkLocalizedPage(page({ jsonld: { url: 'https://dawarich.app/tools/x/' } }), ctx)).toEqual([
      'JSON-LD url not localized: https://dawarich.app/tools/x/',
    ]);
    expect(checkLocalizedPage(page({ robots: 'noindex, follow' }), ctx)).toEqual(['localized page is noindex']);
  });

  it('should allow JSON-LD links to English-only docs and legal pages', () => {
    const jsonld = { url: 'https://dawarich.app/de/tools/x/', mainEntity: { url: 'https://dawarich.app/docs/self-hosting/introduction' } };
    expect(checkLocalizedPage(page({ jsonld }), ctx)).toEqual([]);
  });

  it('should accept a title that is legitimately the same as English when the body is translated', () => {
    expect(checkLocalizedPage(page({ title: 'Converter' }), ctx)).toEqual([]);
  });

  it('should report hreflang targets that were not built', () => {
    const errors = checkLocalizedPage(page(), { ...ctx, exists: (url) => !url.includes('/pt-br/') });
    expect(errors).toEqual(['hreflang pt-BR target missing: https://dawarich.app/pt-br/tools/x/']);
  });

  it('should accept English pages with root URLs and the English title', () => {
    const english = page({
      lang: 'en',
      canonical: ['https://dawarich.app/tools/x/'],
      ogUrl: 'https://dawarich.app/tools/x/',
      title: 'Converter',
      jsonld: { url: 'https://dawarich.app/tools/x/' },
    });
    expect(checkLocalizedPage(english, { ...ctx, locale: 'en' })).toEqual([]);
  });
});

describe('checkEnglishOnlyPage', () => {
  it('should forbid noindex and hreflang on English pages that are not localized', () => {
    expect(checkEnglishOnlyPage(page({ alternates: {}, robots: null }))).toEqual([]);
    expect(checkEnglishOnlyPage(page({ robots: 'noindex, follow' }))).toEqual(['english page is noindex', 'has hreflang alternates']);
  });
});

describe('findGlobalOgUrl', () => {
  it('should detect the legacy name="og:url" meta tag', () => {
    expect(findGlobalOgUrl('<meta name="og:url" content="https://dawarich.app">')).toBe(true);
    expect(findGlobalOgUrl('<meta property="og:url" content="https://dawarich.app/">')).toBe(false);
  });
});

describe('checkNonLocalizedPage', () => {
  it('should require noindex and no hreflang outside English', () => {
    const self = 'https://dawarich.app/de/tools/x/';
    const html = page({ alternates: {}, robots: 'noindex, follow' }).replace('<main>', '<div lang="en"><main>');
    expect(checkNonLocalizedPage(html, self)).toEqual([]);
    expect(checkNonLocalizedPage(page({ robots: null }), self)).toEqual([
      'missing noindex',
      'has hreflang alternates',
      'English content not marked lang="en"',
    ]);
  });

  it('should require canonical and og:url to point at the page itself', () => {
    const html = page({
      alternates: {},
      robots: 'noindex, follow',
      canonical: ['https://dawarich.app/tools/x/'],
      ogUrl: 'https://dawarich.app/tools/x',
    }).replace('<main>', '<div lang="en"><main>');
    expect(checkNonLocalizedPage(html, 'https://dawarich.app/de/tools/x/')).toEqual([
      'canonical https://dawarich.app/tools/x/ != https://dawarich.app/de/tools/x/',
      'og:url https://dawarich.app/tools/x != https://dawarich.app/de/tools/x/',
    ]);
  });
});

describe('checkSitemap', () => {
  it('should list exactly the localized routes under the locale prefix', () => {
    const xml = '<urlset><url><loc>https://dawarich.app/de/tools/x/</loc></url><url><loc>https://dawarich.app/de/roadmap/</loc></url></urlset>';
    expect(checkSitemap(xml, { locale: 'de', routes: ['/tools/x/', '/'] })).toEqual([
      'sitemap lists non-localized https://dawarich.app/de/roadmap/',
      'sitemap misses https://dawarich.app/de/',
    ]);
  });
});

describe('findLocaleDocsLinks', () => {
  it('should find links into docs or blog under a locale prefix', () => {
    const html = '<a href="/de/docs/intro/">x</a><a href="/docs/intro/">y</a><a href="/pt-br/blog/">z</a>';
    expect(findLocaleDocsLinks(html, LOCALES)).toEqual(['/de/docs/intro/', '/pt-br/blog/']);
  });
});

describe('readPage', () => {
  it('should report a missing file instead of throwing', () => {
    const problems = [];
    expect(readPage('/nope/index.html', 'de /x/', problems)).toBeNull();
    expect(problems).toEqual(['de /x/: missing /nope/index.html']);
  });
});

describe('checkLocalizedPage with broken JSON-LD', () => {
  it('should report invalid structured data instead of throwing', () => {
    const html = page().replace(/<script data-rh="true" type="application\/ld\+json">.*?<\/script>/, '<script data-rh="true" type="application/ld+json">{oops</script>');
    expect(checkLocalizedPage(html, ctx)).toEqual(['invalid JSON-LD']);
  });
});
