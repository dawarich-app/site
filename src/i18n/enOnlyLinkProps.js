import { DEFAULT_LOCALE } from './locales.js';

export const EN_ONLY_PREFIXES = [
  '/docs',
  '/blog',
  '/privacy-policy',
  '/terms-and-conditions',
  '/impressum',
  '/refund-policy',
  '/ios',
  '/ios-app-support',
  '/roadmap',
  '/techlore',
  '/credits',
  '/press-kit',
  '/affiliate',
  '/itsfoss',
];

export function isEnOnlyPath(path) {
  return EN_ONLY_PREFIXES.some((prefix) => {
    if (!path.startsWith(prefix)) return false;
    const next = path.charAt(prefix.length);
    return next === '' || next === '/' || next === '?' || next === '#';
  });
}

function withTrailingSlash(path) {
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match[1].endsWith('/') ? match[1] : `${match[1]}/`;
  return pathname + match[2];
}

export function enOnlyLinkProps(path, locale) {
  if (locale === DEFAULT_LOCALE) return { to: path };
  return { to: `pathname://${withTrailingSlash(path)}`, target: '_self', autoAddBaseUrl: false };
}
