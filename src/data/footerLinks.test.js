import { describe, it, expect } from 'vitest';
import { footerLinks, buildFooterLinks, FOOTER_LINK_CAP } from './footerLinks';

const COMPARISONS = [
  '/google-timeline-alternative',
  '/docs/comparisons/vs-owntracks',
  '/docs/comparisons/vs-traccar',
  '/docs/comparisons/vs-google-timeline',
  '/docs/comparisons/vs-strava',
  '/docs/comparisons/vs-polarsteps',
  '/docs/comparisons/vs-life360',
  '/docs/comparisons/vs-arc',
  '/docs/comparisons/vs-geopulse',
  '/docs/comparisons/vs-reitti',
];

const TOP_TOOLS = [
  '/tools/timeline-visualizer',
  '/tools/kml-to-kmz',
  '/tools/photo-geotagging',
  '/tools/google-timeline-converter',
  '/tools/kmz-to-kml',
  '/tools/timeline-mileage-calculator',
  '/tools/geojson-to-kml',
  '/tools/gpx-merger',
  '/tools/tcx-to-gpx',
  '/tools/heatmap-generator',
  '/tools/kmz-to-gpx',
  '/tools/gps-file-splitter',
  '/tools/gpx-to-kmz',
  '/tools/timeline-statistics',
  '/tools/timeline-merger',
  '/tools/kml-to-gpx',
  '/tools/fit-to-gpx',
];

const allItems = () => footerLinks.flatMap((col) => col.items);
const linkItems = () => allItems().filter((i) => i.to || i.href);
const internalTargets = () => linkItems().filter((i) => i.to).map((i) => i.to);

describe('footerLinks', () => {
  it('exposes exactly the six planned columns in order', () => {
    expect(footerLinks.map((c) => c.title)).toEqual([
      'Dawarich', 'Product', 'Tools', 'Compare', 'Docs', 'Company',
    ]);
  });

  it('stays at or below the link cap', () => {
    expect(linkItems().length).toBeLessThanOrEqual(FOOTER_LINK_CAP);
  });

  it('contains no duplicate targets', () => {
    const targets = linkItems().map((i) => i.to ?? i.href);
    expect(new Set(targets).size).toBe(targets.length);
  });

  it('links every Compare-column target', () => {
    for (const url of COMPARISONS) expect(internalTargets()).toContain(url);
  });

  it('links the seventeen footer tools and the tools index', () => {
    for (const url of TOP_TOOLS) expect(internalTargets()).toContain(url);
    expect(internalTargets()).toContain('/tools');
  });

  it('uses root-relative internal targets', () => {
    for (const t of internalTargets()) expect(t.startsWith('/')).toBe(true);
  });

  it('gives every link item a non-empty label', () => {
    for (const i of linkItems()) expect(i.label.trim().length).toBeGreaterThan(0);
  });

  it('groups long columns by the task a visitor wants to do', () => {
    const headings = (title) => footerLinks
      .find((c) => c.title === title)
      .items.filter((i) => i.html)
      .map((i) => i.html.match(/>([^<]+)<\/div>/)?.[1]);

    expect(headings('Product')).toEqual(['Explore', 'Share & create', 'Get started']);
    expect(headings('Tools')).toEqual(['Explore your data', 'Convert files', 'Edit & extract']);
    expect(headings('Company')).toEqual(['About', 'Legal']);
    expect(internalTargets()).toContain('/press-kit');
  });

  it('keeps the Compare column in correct order', () => {
    const compare = footerLinks.find((c) => c.title === 'Compare').items.filter((i) => i.to).map((i) => i.to);
    expect(compare).toEqual(COMPARISONS);
  });

  it('links the About page at the top of the Company column', () => {
    const company = footerLinks.find((c) => c.title === 'Company').items.filter((i) => i.to).map((i) => i.to);
    expect(company[0]).toBe('/about');
  });

  it('pins FOOTER_LINK_CAP to its specified value', () => {
    expect(FOOTER_LINK_CAP).toBe(62);
  });

  // Withdrawing consent has to be as easy as giving it, and the banner that
  // gives it in one click from any page is gone for good once answered. The
  // footer is the only element that persists everywhere afterwards.
  it('reaches the cookie controls from every page', () => {
    const company = footerLinks.find((c) => c.title === 'Company').items.map((i) => i.to);
    expect(company).toContain('/privacy-policy#cookies');
  });
});

describe('buildFooterLinks', () => {
  const find = (links, label) => links.flatMap((c) => c.items).find((i) => i.label === label);

  it('returns the source links unchanged for the default locale', () => {
    expect(buildFooterLinks('en')).toEqual(footerLinks);
  });

  it('points docs, blog and English-only pages at the root English URL in other locales', () => {
    const links = buildFooterLinks('de');
    expect(find(links, 'Changelog')).toMatchObject({ to: 'pathname:///docs/changelog/', target: '_self', autoAddBaseUrl: false });
    expect(find(links, 'Blog')).toMatchObject({ to: 'pathname:///blog/', autoAddBaseUrl: false });
    expect(find(links, 'Impressum')).toMatchObject({ to: 'pathname:///impressum/' });
    expect(find(links, 'Roadmap')).toMatchObject({ to: 'pathname:///roadmap/' });
  });

  it('keeps localized routes and external links untouched in other locales', () => {
    const links = buildFooterLinks('de');
    expect(find(links, 'Pricing')).toEqual({ label: 'Pricing', to: '/pricing' });
    expect(find(links, 'Community')).toEqual({ label: 'Community', href: 'https://discourse.dawarich.app/' });
  });
});

describe('buildFooterLinks section headings', () => {
  const headings = (locale, column) => buildFooterLinks(locale)
    .find((c) => c.title === column)
    .items.filter((i) => i.html)
    .map((i) => i.html);

  it('localizes the section headings instead of replacing them with the brand block', () => {
    const product = headings('de', 'Product');
    expect(product).toHaveLength(3);
    expect(product[0]).toBe('<div class="dawarich-footer-subtitle">Entdecken</div>');
    expect(product.join('')).not.toContain('ZeitFlow');
  });
});

describe('buildFooterLinks brand column', () => {
  const brand = (locale) => buildFooterLinks(locale)[0].items[0].html;

  it('renders the English brand text by default', () => {
    expect(brand('en')).toContain('<span>Made and hosted in Europe</span>');
    expect(brand('en')).toContain('<p>Berlin, Germany</p>');
    expect(brand('en')).toContain('>Start tracking →</a>');
  });

  it('uses the locale config strings for the brand text', () => {
    expect(brand('de')).toContain('<span>In Europa entwickelt und gehostet</span>');
    expect(brand('de')).toContain('<p>Berlin, Deutschland</p>');
    expect(brand('de')).toContain('>Jetzt mit dem Tracking starten →</a>');
    expect(brand('de')).toContain('ZeitFlow UG (haftungsbeschränkt)');
  });
});
