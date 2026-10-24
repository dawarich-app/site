import { DEFAULT_LOCALE, LOCALES } from './locales.js';

export const LOCALIZED_ROUTES = ['/tools/google-timeline-converter/'];

function normalize(path) {
  const pathname = path.replace(/[?#].*$/, '');
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function stripLocalePrefix(pathname, locales = LOCALES) {
  for (const locale of locales) {
    if (locale === DEFAULT_LOCALE) continue;
    const prefix = `/${locale}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

export function isLocalizedRoute(path, routes = LOCALIZED_ROUTES) {
  const target = normalize(path);
  return routes.some((route) => normalize(route) === target);
}
