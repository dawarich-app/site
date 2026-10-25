import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PLANS } from '../data/pricingPlans';

const state = vi.hoisted(() => ({ locale: 'en' }));
vi.mock('@docusaurus/useDocusaurusContext', async () => {
  const original = await vi.importActual('@docusaurus/useDocusaurusContext');
  return { default: () => {
    const context = original.default();
    return { ...context, i18n: { ...context.i18n, currentLocale: state.locale } };
  } };
});

import Subject from './PricingCard';

const text = (selector) => document.querySelector(selector).textContent.replace(/[  ]/g, ' ');

describe('PricingCard prices', () => {
  it('should keep the English price layout', () => {
    state.locale = 'en';
    render(<Subject plan={PLANS.family} />);
    expect(text('.priceMainRow')).toMatch(/^€239\.99/);
    expect(text('.valueTotal')).toBe('€1,039');
  });

  it('should write prices the German way in German', () => {
    state.locale = 'de';
    render(<Subject plan={PLANS.family} />);
    expect(text('.priceMainRow')).toMatch(/^239,99€/);
    expect(text('.valueTotal')).toBe('1.039 €');
    expect(text('.valueAmount')).toBe('180 €');
  });
});
