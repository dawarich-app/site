import { describe, it, expect } from 'vitest';
import { LOCALES, DEFAULT_LOCALE, resolveBuildLocale, OG_LOCALES } from './locales';

describe('resolveBuildLocale', () => {
  it('falls back to en when the env var is unset', () => {
    expect(resolveBuildLocale(undefined)).toBe('en');
  });

  it('falls back to en for the literal "undefined" string set by `docusaurus start` without --locale', () => {
    expect(resolveBuildLocale('undefined')).toBe('en');
  });

  it('returns a configured locale unchanged', () => {
    expect(resolveBuildLocale('de')).toBe('de');
    expect(resolveBuildLocale('pt-br')).toBe('pt-br');
  });

  it('rejects locales that are not configured, including wrong casing', () => {
    expect(resolveBuildLocale('pt-BR')).toBe('en');
    expect(resolveBuildLocale('ru')).toBe('en');
  });
});

describe('LOCALES', () => {
  it('lists the app locales plus pt-br with en first', () => {
    expect(LOCALES).toEqual(['en', 'de', 'es', 'fr', 'pl', 'ca', 'zh', 'pt-br']);
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('OG_LOCALES', () => {
  it('should give every locale an Open Graph language_TERRITORY code', () => {
    expect(Object.keys(OG_LOCALES).sort()).toEqual([...LOCALES].sort());
    for (const code of Object.values(OG_LOCALES)) expect(code).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
    expect(OG_LOCALES.zh).toBe('zh_CN');
    expect(OG_LOCALES['pt-br']).toBe('pt_BR');
  });
});
