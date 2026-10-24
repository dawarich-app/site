import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

vi.mock('@locale-content/components/FAQ.json', async () => {
  const en = structuredClone((await import('../i18n/content/en/components/FAQ.json')).default);
  en.title = 'Lokalisierter FAQ';
  return { default: en };
});
import Subject from './FAQ';

describe('FAQ content source', () => {
  it('renders whatever the locale content module provides', () => {
    render(<Subject />);
    expect(screen.getByText('Lokalisierter FAQ', { exact: true })).toBeInTheDocument();
  });
});
