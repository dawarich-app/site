import { describe, it, expect } from 'vitest';
import { seoMeta, SITE_TITLE_SUFFIX, RENDERED_TITLE_MAX, DESCRIPTION_MAX } from './seoMeta';

const KEYWORD_PREFIX_CHARS = 50;

const EXPECTED_KEYWORDS = {
  'timeline-visualizer': 'Google Timeline Viewer',
  'photo-geotagging': 'Extract GPS From Photo',
  'timeline-mileage-calculator': 'Mileage Calculator',
  'location-tracking': 'Location Tracking',
};

const slugs = Object.keys(seoMeta);
const renderedTitle = (slug) => seoMeta[slug].title + SITE_TITLE_SUFFIX;

describe('seoMeta', () => {
  it('covers the four rewrite targets', () => {
    expect(slugs.slice().sort()).toEqual([
      'location-tracking',
      'photo-geotagging',
      'timeline-mileage-calculator',
      'timeline-visualizer',
    ]);
  });

  it('pins the limits to their specified values', () => {
    expect(RENDERED_TITLE_MAX).toBe(60);
    expect(DESCRIPTION_MAX).toBe(160);
    expect(SITE_TITLE_SUFFIX).toBe(' | Dawarich');
  });

  it.each(slugs)('%s rendered title fits within the SERP limit', (slug) => {
    expect(renderedTitle(slug).length).toBeLessThanOrEqual(RENDERED_TITLE_MAX);
  });

  it.each(slugs)('%s description fits within the SERP limit', (slug) => {
    expect(seoMeta[slug].description.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });

  it.each(slugs)('%s declares the intended target keyword', (slug) => {
    expect(seoMeta[slug].keyword).toBe(EXPECTED_KEYWORDS[slug]);
  });

  it.each(slugs)('%s front-loads its target keyword', (slug) => {
    const prefix = seoMeta[slug].title.slice(0, KEYWORD_PREFIX_CHARS).toLowerCase();
    expect(prefix).toContain(EXPECTED_KEYWORDS[slug].toLowerCase());
  });
});
