import React from 'react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/components/PricingCard.json';
import { PLANS } from '../data/pricingPlans';

vi.mock('@paddle/paddle-js', () => ({ initializePaddle: vi.fn() }));
beforeEach(() => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.stubGlobal('IntersectionObserver', class { observe() {} unobserve() {} disconnect() {} });
});
import Subject from './PricingCard';

describe('PricingCard locale content', () => {
  it('renders its heading or label from English content', () => {
    render(<Subject plan={PLANS.pro} popular />);
    expect(screen.getByText(content.ribbon.trim(), { exact: true })).toBeInTheDocument();
  });
});

describe('PricingCard billing toggle', () => {
  it('lets the Family card switch to monthly billing', async () => {
    const { fireEvent } = await import('@testing-library/react');
    render(<Subject plan={PLANS.family} />);

    fireEvent.click(screen.getByRole('button', { name: content.billing.monthly }));

    expect(screen.getByText('34.99', { exact: false })).toBeInTheDocument();
    expect(screen.getByText(content.billedMonthly)).toBeInTheDocument();
  });
});
