import { DEFAULT_LOCALE } from './locales.js';

export const SITE_URL = 'https://dawarich.app';

export function localizedUrl(path, locale) {
  const pathname = path.endsWith('/') ? path : `${path}/`;
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${pathname}`;
}
