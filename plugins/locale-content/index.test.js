import { describe, it, expect } from 'vitest';
import localeContentPlugin from './index.js';

describe('locale-content plugin', () => {
  const context = (locale) => ({ siteDir: '/site', i18n: { currentLocale: locale, defaultLocale: 'en' } });

  it('should resolve @locale-content to the English files', () => {
    const config = localeContentPlugin(context('de')).configureWebpack();
    expect(config.resolve.alias['@locale-content']).toBe('/site/src/i18n/content/en');
  });

  it('should run the merge loader on English content files with the current locale', () => {
    const rule = localeContentPlugin(context('de')).configureWebpack().module.rules[0];
    expect(rule.include).toBe('/site/src/i18n/content/en');
    expect(rule.use[0].options).toEqual({ locale: 'de', defaultLocale: 'en', contentDir: '/site/src/i18n/content' });
  });
});
