import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

vi.mock('@locale-content/pages/pricing.json', async () => {
  const en = structuredClone((await import('../i18n/content/en/pages/pricing.json')).default);
  en.meta.title = 'Lokalisierter pricing';
  return { default: en };
});
import Subject from './pricing';

describe('pricing content source', () => {
  it('renders whatever the locale content module provides', () => {
    render(<Subject />);
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute('content', 'Lokalisierter pricing | Dawarich');
  });
});
