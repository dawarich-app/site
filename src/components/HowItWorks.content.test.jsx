import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

vi.mock('@locale-content/components/HowItWorks.json', async () => {
  const en = structuredClone((await import('../i18n/content/en/components/HowItWorks.json')).default);
  en.step = 'Abschnitt {number}';
  return { default: en };
});
import Subject from './HowItWorks';

describe('HowItWorks content source', () => {
  it('renders whatever the locale content module provides', () => {
    render(<Subject title="Example steps" steps={[{ title: "Track" }]} variant="route" />);
    expect(screen.getByText('Abschnitt 01', { exact: true })).toBeInTheDocument();
  });
});
