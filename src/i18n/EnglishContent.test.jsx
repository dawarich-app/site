import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

const state = vi.hoisted(() => ({ locale: 'de', pathname: '/de/roadmap/' }));
vi.mock('@docusaurus/router', () => ({ useLocation: () => ({ pathname: state.pathname }) }));
vi.mock('@docusaurus/useDocusaurusContext', async () => {
  const original = await vi.importActual('@docusaurus/useDocusaurusContext');
  return { default: () => {
    const context = original.default();
    return { ...context, i18n: { ...context.i18n, currentLocale: state.locale } };
  } };
});

import EnglishContent from './EnglishContent';

const langOf = () => document.querySelector('main').closest('[lang]')?.getAttribute('lang') ?? null;

describe('EnglishContent', () => {
  it('should mark English-only pages under a locale as English', () => {
    Object.assign(state, { locale: 'de', pathname: '/de/roadmap/' });
    render(<EnglishContent><main>x</main></EnglishContent>);
    expect(langOf()).toBe('en');
  });

  it('should leave localized pages, the 404 page and the English site unmarked', () => {
    for (const [locale, pathname] of [['de', '/de/pricing/'], ['de', '/de/missing/'], ['en', '/roadmap/']]) {
      Object.assign(state, { locale, pathname });
      const { unmount } = render(<EnglishContent><main>x</main></EnglishContent>);
      expect(langOf()).toBeNull();
      unmount();
    }
  });
});
