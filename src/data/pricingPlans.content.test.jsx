import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});

vi.mock('@locale-content/shared/pricingPlans.json', async () => {
  const en = structuredClone((await import('../i18n/content/en/shared/pricingPlans.json')).default);
  en.plans.pro.name = 'Lokalisierter pricingPlans';
  return { default: en };
});
import PricingCard from '../components/PricingCard';
import { PLANS } from './pricingPlans';

describe('pricingPlans content source', () => {
  it('renders whatever the locale content module provides', () => {
    render(<PricingCard plan={PLANS.pro} />);
    expect(screen.getByText('Lokalisierter pricingPlans', { exact: true })).toBeInTheDocument();
  });
});
