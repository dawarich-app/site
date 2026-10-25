import { DEFAULT_LOCALE, LOCALES, LOCALE_CONFIGS } from '../../i18n/locales';

const context = {
  siteConfig: { url: 'https://dawarich.app', baseUrl: '/' },
  i18n: {
    currentLocale: DEFAULT_LOCALE,
    defaultLocale: DEFAULT_LOCALE,
    locales: LOCALES,
    localeConfigs: LOCALE_CONFIGS,
  },
};

export default function useDocusaurusContext() {
  return context;
}
