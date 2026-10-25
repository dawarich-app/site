export const DEFAULT_LOCALE = 'en';

export const LOCALES = ['en', 'de', 'es', 'fr', 'pl', 'ca', 'zh', 'pt-br'];

export const LOCALE_CONFIGS = {
  en: { label: 'English', htmlLang: 'en' },
  de: { label: 'Deutsch', htmlLang: 'de' },
  es: { label: 'Español', htmlLang: 'es' },
  fr: { label: 'Français', htmlLang: 'fr' },
  pl: { label: 'Polski', htmlLang: 'pl' },
  ca: { label: 'Català', htmlLang: 'ca' },
  zh: { label: '简体中文', htmlLang: 'zh-Hans' },
  'pt-br': { label: 'Português (Brasil)', htmlLang: 'pt-BR' },
};

export const OG_LOCALES = {
  en: 'en_US',
  de: 'de_DE',
  es: 'es_ES',
  fr: 'fr_FR',
  pl: 'pl_PL',
  ca: 'ca_ES',
  zh: 'zh_CN',
  'pt-br': 'pt_BR',
};

export function resolveBuildLocale(raw) {
  return LOCALES.includes(raw) ? raw : DEFAULT_LOCALE;
}
