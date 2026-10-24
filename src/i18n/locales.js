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

export function resolveBuildLocale(raw) {
  return LOCALES.includes(raw) ? raw : DEFAULT_LOCALE;
}
