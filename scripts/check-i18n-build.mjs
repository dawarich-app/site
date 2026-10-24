import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DEFAULT_LOCALE, LOCALES, LOCALE_CONFIGS } from '../src/i18n/locales.js';
import { LOCALIZED_ROUTES } from '../src/i18n/localizedRoutes.js';
import { localizedUrl, SITE_URL } from '../src/i18n/localizedUrl.js';
import { isEnOnlyPath } from '../src/i18n/enOnlyLinkProps.js';

const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const tags = (html, pattern) => html.match(new RegExp(pattern, 'g')) ?? [];

function readTitle(html) {
  const raw = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? '';
  return raw.replace(/ \| Dawarich$/, '').trim();
}

function jsonLdUrls(html) {
  const urls = [];
  for (const block of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    JSON.stringify(JSON.parse(block[1]), (key, value) => {
      if ((key === 'url' || key === 'item') && typeof value === 'string' && value.startsWith(SITE_URL)) urls.push(value);
      return value;
    });
  }
  return urls;
}

const isNoindex = (html) => tags(html, '<meta[^>]*name="robots"[^>]*>').some((t) => /noindex/.test(attr(t, 'content') ?? ''));
const alternates = (html) => tags(html, '<link[^>]*rel="alternate"[^>]*hreflang="[^"]*"[^>]*>');

export function checkLocalizedPage(html, { route, locale, locales, htmlLang, englishTitle, exists }) {
  const errors = [];
  const expected = localizedUrl(route, locale);
  const lang = html.match(/<html[^>]*lang="([^"]+)"/)?.[1];
  if (lang !== htmlLang[locale]) errors.push(`html lang ${lang} != ${htmlLang[locale]}`);
  const canonicals = tags(html, '<link[^>]*rel="canonical"[^>]*>').map((t) => attr(t, 'href'));
  if (canonicals.length !== 1) errors.push(`expected 1 canonical, found ${canonicals.length}`);
  else if (canonicals[0] !== expected) errors.push(`canonical ${canonicals[0]} != ${expected}`);
  const links = alternates(html).map((t) => ({ hreflang: attr(t, 'hreflang'), href: attr(t, 'href') }));
  const wanted = [...locales.map((l) => htmlLang[l]), 'x-default'].sort().join(',');
  const found = links.map((l) => l.hreflang).sort().join(',');
  if (found !== wanted) errors.push(`hreflang set ${found} != ${wanted}`);
  else for (const link of links) if (!exists(link.href)) errors.push(`hreflang ${link.hreflang} target missing: ${link.href}`);
  const ogUrl = tags(html, '<meta[^>]*property="og:url"[^>]*>').map((t) => attr(t, 'content')).pop();
  if (ogUrl !== expected) errors.push(`og:url ${ogUrl} != canonical`);
  if (locale !== DEFAULT_LOCALE && readTitle(html) === englishTitle) errors.push('title not translated');
  if (locale !== DEFAULT_LOCALE) {
    for (const url of jsonLdUrls(html)) {
      if (url.startsWith(`${SITE_URL}/${locale}/`) || isEnOnlyPath(url.slice(SITE_URL.length))) continue;
      errors.push(`JSON-LD url not localized: ${url}`);
    }
  }
  if (isNoindex(html)) errors.push('localized page is noindex');
  return errors;
}

export function checkNonLocalizedPage(html) {
  const errors = [];
  if (!isNoindex(html)) errors.push('missing noindex');
  if (alternates(html).length > 0) errors.push('has hreflang alternates');
  return errors;
}

export function checkSitemap(xml, { locale, routes }) {
  const listed = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const wanted = routes.map((route) => localizedUrl(route, locale));
  return [
    ...listed.filter((url) => !wanted.includes(url)).map((url) => `sitemap lists non-localized ${url}`),
    ...wanted.filter((url) => !listed.includes(url)).map((url) => `sitemap misses ${url}`),
  ];
}

export function findLocaleDocsLinks(html, locales) {
  const prefixes = locales.filter((l) => l !== DEFAULT_LOCALE).map((l) => `/${l}/`);
  return [...html.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((href) => prefixes.some((p) => href.startsWith(`${p}docs`) || href.startsWith(`${p}blog`)));
}

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.name.endsWith('.html') ? [full] : [];
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const build = path.resolve('build');
  const htmlLang = Object.fromEntries(LOCALES.map((l) => [l, LOCALE_CONFIGS[l].htmlLang]));
  const fileFor = (route, locale) =>
    path.join(build, locale === DEFAULT_LOCALE ? '' : locale, route.replace(/^\//, ''), 'index.html');
  const exists = (url) => fs.existsSync(path.join(build, url.slice(SITE_URL.length).replace(/^\//, ''), 'index.html'));
  const problems = [];
  const report = (where, errors) => errors.forEach((e) => problems.push(`${where}: ${e}`));
  for (const route of LOCALIZED_ROUTES) {
    const englishTitle = readTitle(fs.readFileSync(fileFor(route, DEFAULT_LOCALE), 'utf8'));
    for (const locale of LOCALES) {
      const html = fs.readFileSync(fileFor(route, locale), 'utf8');
      report(`${locale} ${route}`, checkLocalizedPage(html, { route, locale, locales: LOCALES, htmlLang, englishTitle, exists }));
    }
  }
  for (const locale of LOCALES.filter((l) => l !== DEFAULT_LOCALE)) {
    for (const route of ['/roadmap/', '/privacy-policy/', '/techlore/']) {
      report(`${locale} ${route}`, checkNonLocalizedPage(fs.readFileSync(fileFor(route, locale), 'utf8')));
    }
    report(`${locale} sitemap`, checkSitemap(fs.readFileSync(path.join(build, locale, 'sitemap.xml'), 'utf8'), { locale, routes: LOCALIZED_ROUTES }));
  }
  const robots = fs.readFileSync(path.join(build, 'robots.txt'), 'utf8');
  for (const locale of LOCALES) {
    const sitemap = locale === DEFAULT_LOCALE ? `${SITE_URL}/sitemap.xml` : `${SITE_URL}/${locale}/sitemap.xml`;
    if (!robots.includes(`Sitemap: ${sitemap}`)) problems.push(`robots.txt misses ${sitemap}`);
  }
  for (const file of htmlFiles(build)) {
    const links = findLocaleDocsLinks(fs.readFileSync(file, 'utf8'), LOCALES);
    if (links.length) problems.push(`${path.relative(build, file)}: links into locale docs/blog ${links[0]}`);
  }
  if (fs.existsSync(path.resolve('i18n/en'))) problems.push('i18n/en exists (would freeze English text)');
  for (const p of problems) console.log(p);
  console.log(`check-i18n-build: ${problems.length} problem(s), ${LOCALIZED_ROUTES.length} routes × ${LOCALES.length} locales`);
  process.exit(problems.length ? 1 : 0);
}
