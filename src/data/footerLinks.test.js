import { describe, it, expect } from 'vitest';
import { footerLinks, FOOTER_LINK_CAP } from './footerLinks';

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

  it('keeps the Tools column in measured-click order', () => {
    const tools = footerLinks.find((c) => c.title === 'Tools').items.map((i) => i.to);
    expect(tools).toEqual([
      ...TOP_TOOLS,
      '/tools',
    ]);
  });

  it('keeps the Compare column in correct order', () => {
    const compare = footerLinks.find((c) => c.title === 'Compare').items.map((i) => i.to);
    expect(compare).toEqual(COMPARISONS);
  });

  it('pins FOOTER_LINK_CAP to its specified value', () => {
    expect(FOOTER_LINK_CAP).toBe(60);
  });
});
