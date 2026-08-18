import { describe, it, expect } from 'vitest';
import { PLANS } from './pricingPlans';
import {
  COMMISSION_RATE,
  COOKIE_WINDOW_DAYS,
  PORTAL_SIGNUP_URL,
  EARNINGS,
} from './affiliateProgram';

const euros = (s) => Number.parseFloat(s);

describe('affiliate program data', () => {
  it('pays 40% of first-year revenue', () => {
    expect(COMMISSION_RATE).toBe(0.4);
  });

  it('derives every payout from the live pricing data', () => {
    for (const row of EARNINGS) {
      expect(row.commission).toBeCloseTo(row.firstYearRevenue * COMMISSION_RATE, 2);
    }
  });

  it('uses the same prices the pricing page shows', () => {
    const byKey = Object.fromEntries(EARNINGS.map((r) => [r.key, r]));

    expect(byKey.lite.firstYearRevenue).toBeCloseTo(euros(PLANS.lite.price), 2);
    expect(byKey.proAnnual.firstYearRevenue).toBeCloseTo(euros(PLANS.pro.price), 2);
    expect(byKey.family.firstYearRevenue).toBeCloseTo(euros(PLANS.family.price), 2);
  });

  it('bills a monthly referral over twelve payments, not as a lump', () => {
    const monthly = EARNINGS.find((r) => r.key === 'proMonthly');

    expect(monthly.firstYearRevenue).toBeCloseTo(euros(PLANS.pro.priceMonthly) * 12, 2);
    expect(monthly.note).toMatch(/12 payments/i);
  });

  it('states the cookie window the code actually honours', () => {
    expect(COOKIE_WINDOW_DAYS).toBe(90);
  });

  it('sends new affiliates to the register page, not the login page', () => {
    expect(PORTAL_SIGNUP_URL).toBe('https://dawarich.partneroapp.com/register');
  });
});
