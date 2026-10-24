import { describe, it, expect } from 'vitest';
import localeContentPlugin from './index.js';

describe('locale-content plugin', () => {
  const context = (locale) => ({ siteDir: '/site', i18n: { currentLocale: locale, defaultLocale: 'en' } });

  it('should resolve @locale-content to the current locale first and en second', () => {
    const plugin = localeContentPlugin(context('de'));
    expect(plugin.configureWebpack().resolve.alias['@locale-content']).toEqual([
      '/site/src/i18n/content/de',
      '/site/src/i18n/content/en',
    ]);
  });

  it('should resolve only en for the default locale', () => {
    const plugin = localeContentPlugin(context('en'));
    expect(plugin.configureWebpack().resolve.alias['@locale-content']).toEqual(['/site/src/i18n/content/en']);
  });
});
