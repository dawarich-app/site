import { describe, it, expect } from 'vitest';
import { localizedUrl, SITE_URL } from './localizedUrl';

describe('localizedUrl', () => {
  it('should return the root URL for the default locale', () => {
    expect(localizedUrl('/tools/x/', 'en')).toBe('https://dawarich.app/tools/x/');
  });

  it('should prefix other locales with their lowercase path', () => {
    expect(localizedUrl('/tools/x/', 'de')).toBe('https://dawarich.app/de/tools/x/');
    expect(localizedUrl('/tools/x/', 'pt-br')).toBe('https://dawarich.app/pt-br/tools/x/');
    expect(localizedUrl('/', 'zh')).toBe('https://dawarich.app/zh/');
  });

  it('should add a trailing slash to match the site trailingSlash setting', () => {
    expect(localizedUrl('/tools/x', 'de')).toBe('https://dawarich.app/de/tools/x/');
  });

  it('should expose the production site URL', () => {
    expect(SITE_URL).toBe('https://dawarich.app');
  });
});
