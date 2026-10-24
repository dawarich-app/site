import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/shared/pricingPlans.json';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});
import PricingCard from '../components/PricingCard';
import { PLANS } from './pricingPlans';

describe('pricingPlans locale content', () => {
  it('renders its heading or label from English content', () => {
    render(<PricingCard plan={PLANS.pro} />);
    expect(screen.getByText(content.plans.pro.name.trim(), { exact: true })).toBeInTheDocument();
  });
});
