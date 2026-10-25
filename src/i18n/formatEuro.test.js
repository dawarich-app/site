import { describe, it, expect } from 'vitest';
import { formatEuro, euroParts } from './formatEuro';

const plain = (s) => s.replace(/[  ]/g, ' ');

describe('formatEuro', () => {
  it('should keep the current English output', () => {
    expect(formatEuro(59.99, { locale: 'en' })).toBe('€59.99');
    expect(formatEuro(5, { locale: 'en', decimals: 2 })).toBe('€5.00');
    expect(formatEuro(1039, { locale: 'en' })).toBe('€1,039');
  });

  it('should format amounts the way each locale writes them', () => {
    expect(plain(formatEuro(119.99, { locale: 'de' }))).toBe('119,99 €');
    expect(plain(formatEuro(1039, { locale: 'de' }))).toBe('1.039 €');
    expect(plain(formatEuro(0.16, { locale: 'fr' }))).toBe('0,16 €');
    expect(plain(formatEuro(5, { locale: 'pt-br', decimals: 2 }))).toBe('€ 5,00');
    expect(formatEuro(239.99, { locale: 'zh' })).toBe('€239.99');
  });

  it('should default to the build locale', () => {
    expect(formatEuro(17.99)).toBe('€17.99');
  });
});

describe('euroParts', () => {
  it('should split the symbol from the amount and keep the order of the locale', () => {
    expect(euroParts(59.99, { locale: 'en' })).toEqual({ before: '€', amount: '59.99', after: '' });
    expect(euroParts(59.99, { locale: 'de' })).toEqual({ before: '', amount: '59,99', after: '€' });
  });
});
