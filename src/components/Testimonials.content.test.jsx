import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

vi.mock('@locale-content/components/Testimonials.json', async () => {
  const en = structuredClone((await import('../i18n/content/en/components/Testimonials.json')).default);
  en.title = 'Lokalisierter Testimonials';
  return { default: en };
});
import Subject from './Testimonials';

describe('Testimonials content source', () => {
  it('renders whatever the locale content module provides', () => {
    render(<Subject />);
    expect(screen.getByText('Lokalisierter Testimonials', { exact: true })).toBeInTheDocument();
  });
});
