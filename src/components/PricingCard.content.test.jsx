import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PLANS } from '../data/pricingPlans';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

vi.mock('@locale-content/components/PricingCard.json', async () => {
  const en = structuredClone((await import('../i18n/content/en/components/PricingCard.json')).default);
  en.ribbon = 'Lokalisierter PricingCard';
  en.billing.monthly = 'Monatlich';
  return { default: en };
});
import Subject from './PricingCard';

describe('PricingCard content source', () => {
  it('renders whatever the locale content module provides', () => {
    render(<Subject plan={PLANS.pro} popular />);
    expect(screen.getByText('Lokalisierter PricingCard', { exact: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Monatlich' })).toBeInTheDocument();
  });
});
