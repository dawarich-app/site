import { describe, it, expect } from 'vitest';
import { enOnlyLinkProps, isEnOnlyPath } from './enOnlyLinkProps';

describe('enOnlyLinkProps', () => {
  it('should return a plain internal link in the default locale', () => {
    expect(enOnlyLinkProps('/docs/intro', 'en')).toEqual({ to: '/docs/intro' });
  });

  it('should bypass the locale base URL and stay in the same tab in other locales', () => {
    expect(enOnlyLinkProps('/docs/intro', 'de')).toEqual({
      to: 'pathname:///docs/intro/',
      target: '_self',
      autoAddBaseUrl: false,
    });
  });

  it('should add the trailing slash only once', () => {
    expect(enOnlyLinkProps('/blog/', 'pt-br').to).toBe('pathname:///blog/');
  });

  it('should keep query strings and hashes after the trailing slash', () => {
    expect(enOnlyLinkProps('/docs/intro#install', 'fr').to).toBe('pathname:///docs/intro/#install');
    expect(enOnlyLinkProps('/blog?tag=x', 'fr').to).toBe('pathname:///blog/?tag=x');
  });
});

describe('isEnOnlyPath', () => {
  it('should match docs, blog and English-only pages', () => {
    expect(isEnOnlyPath('/docs/self-hosting/introduction')).toBe(true);
    expect(isEnOnlyPath('/blog')).toBe(true);
    expect(isEnOnlyPath('/privacy-policy/')).toBe(true);
    expect(isEnOnlyPath('/roadmap')).toBe(true);
    expect(isEnOnlyPath('/ios/privacy-policy/')).toBe(true);
  });

  it('should not match localized routes or external URLs', () => {
    expect(isEnOnlyPath('/tools/gpx-to-kml/')).toBe(false);
    expect(isEnOnlyPath('/pricing')).toBe(false);
    expect(isEnOnlyPath('/documentation-is-not-docs')).toBe(false);
    expect(isEnOnlyPath('https://dawarich.app/docs/intro')).toBe(false);
  });
});
