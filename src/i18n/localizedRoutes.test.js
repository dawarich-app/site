import { describe, it, expect } from 'vitest';
import { LOCALIZED_ROUTES, stripLocalePrefix, isLocalizedRoute } from './localizedRoutes';

describe('stripLocalePrefix', () => {
  it('should remove a non-default locale prefix', () => {
    expect(stripLocalePrefix('/pt-br/tools/x/')).toBe('/tools/x/');
    expect(stripLocalePrefix('/de/pricing/')).toBe('/pricing/');
  });

  it('should map a locale home page to the root path', () => {
    expect(stripLocalePrefix('/zh/')).toBe('/');
    expect(stripLocalePrefix('/zh')).toBe('/');
  });

  it('should leave default-locale paths alone', () => {
    expect(stripLocalePrefix('/tools/x/')).toBe('/tools/x/');
    expect(stripLocalePrefix('/')).toBe('/');
  });

  it('should not strip path segments that merely start like a locale', () => {
    expect(stripLocalePrefix('/decks/')).toBe('/decks/');
    expect(stripLocalePrefix('/pt-brazil/')).toBe('/pt-brazil/');
  });
});

describe('isLocalizedRoute', () => {
  const routes = ['/', '/tools/x/'];

  it('should match allowlisted routes with or without the trailing slash', () => {
    expect(isLocalizedRoute('/tools/x/', routes)).toBe(true);
    expect(isLocalizedRoute('/tools/x', routes)).toBe(true);
    expect(isLocalizedRoute('/', routes)).toBe(true);
  });

  it('should ignore query strings and hashes', () => {
    expect(isLocalizedRoute('/tools/x/?utm_source=a#faq', routes)).toBe(true);
  });

  it('should reject routes that are not allowlisted', () => {
    expect(isLocalizedRoute('/roadmap/', routes)).toBe(false);
    expect(isLocalizedRoute('/tools/x/extra/', routes)).toBe(false);
  });

  it('should default to the real allowlist', () => {
    expect(Array.isArray(LOCALIZED_ROUTES)).toBe(true);
    expect(isLocalizedRoute('/roadmap/')).toBe(false);
  });
});
