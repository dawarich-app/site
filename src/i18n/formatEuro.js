import { DEFAULT_LOCALE, LOCALE_CONFIGS } from './locales';

export const SITE_LOCALE = typeof __SITE_LOCALE__ === 'undefined' ? DEFAULT_LOCALE : __SITE_LOCALE__;

function formatter(amount, { locale = SITE_LOCALE, decimals } = {}) {
  const digits = decimals ?? (Number.isInteger(amount) ? 0 : 2);
  return new Intl.NumberFormat(LOCALE_CONFIGS[locale].htmlLang, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function formatEuro(amount, options) {
  return formatter(amount, options).format(amount);
}

export function euroParts(amount, options) {
  const parts = formatter(amount, options).formatToParts(amount);
  const symbolAt = parts.findIndex((part) => part.type === 'currency');
  const numberAt = parts.findIndex((part) => part.type === 'integer');
  const amountText = parts
    .filter((part) => !['currency', 'literal'].includes(part.type))
    .map((part) => part.value)
    .join('');
  return symbolAt < numberAt
    ? { before: parts[symbolAt].value, amount: amountText, after: '' }
    : { before: '', amount: amountText, after: parts[symbolAt].value };
}
