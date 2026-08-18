import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PLANS } from './pricingPlans';
import { REFERRAL_STORAGE_DURATION } from '../utils/utm';
import {
  COMMISSION_RATE,
  COMMISSION_PERCENT,
  COOKIE_WINDOW_DAYS,
  PORTAL_SIGNUP_URL,
  EARNINGS,
} from './affiliateProgram';

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

    expect(byKey.lite.firstYearRevenue).toBeCloseTo(Number.parseFloat(PLANS.lite.price), 2);
    expect(byKey.proAnnual.firstYearRevenue).toBeCloseTo(Number.parseFloat(PLANS.pro.price), 2);
    expect(byKey.family.firstYearRevenue).toBeCloseTo(Number.parseFloat(PLANS.family.price), 2);
  });

  it('bills a monthly referral over twelve payments, not as a lump', () => {
    const monthly = EARNINGS.find((r) => r.key === 'proMonthly');

    expect(monthly.firstYearRevenue).toBeCloseTo(Number.parseFloat(PLANS.pro.priceMonthly) * 12, 2);
    expect(monthly.note).toMatch(/12 payments/i);
  });

  it('advertises the window the forwarding code actually honours', () => {
    expect(COOKIE_WINDOW_DAYS * 24 * 60 * 60 * 1000).toBe(REFERRAL_STORAGE_DURATION);
  });

  it('sends new affiliates to the register page, not the login page', () => {
    expect(PORTAL_SIGNUP_URL).toBe('https://dawarich.partneroapp.com/register');
  });

  it('exposes the commission rate as the whole percent shown on the page', () => {
    expect(COMMISSION_PERCENT).toBe(Math.round(COMMISSION_RATE * 100));
  });
});

describe('euros() price parser', () => {
  it('parses plain decimal strings', async () => {
    const { parseEurosForTest } = await import('./affiliateProgram');
    expect(parseEurosForTest('59.99')).toBe(59.99);
  });

  it('strips leading currency symbols', async () => {
    const { parseEurosForTest } = await import('./affiliateProgram');
    expect(parseEurosForTest('€59.99')).toBe(59.99);
    expect(parseEurosForTest('$100.50')).toBe(100.50);
  });

  it('removes thousands separators', async () => {
    const { parseEurosForTest } = await import('./affiliateProgram');
    expect(parseEurosForTest('1,039')).toBe(1039);
  });

  it('throws on invalid/non-finite values', async () => {
    const { parseEurosForTest } = await import('./affiliateProgram');
    expect(() => parseEurosForTest('not a number')).toThrow();
    expect(() => parseEurosForTest('€abc')).toThrow();
    expect(() => parseEurosForTest(NaN)).toThrow();
  });

  it('throws on strings mixing "." and "," instead of guessing the format', async () => {
    const { parseEurosForTest } = await import('./affiliateProgram');
    // European formatting (dot thousands, comma decimal) — would silently
    // become 1.29999 if commas were just stripped.
    expect(() => parseEurosForTest('1.299,99')).toThrow();
    // US formatting (comma thousands, dot decimal) is equally ambiguous
    // once both separators can appear, so it is rejected too.
    expect(() => parseEurosForTest('1,299.99')).toThrow();
  });
});

describe('affiliate program data propagation', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('flows price changes through to commissions via dynamic import', async () => {
    // Mock a mutated PLANS object with a different pro.price
    vi.doMock('./pricingPlans', () => ({
      PLANS: {
        lite: { price: '59.99' },
        pro: { price: '299.99', priceMonthly: '17.99' }, // doubled from 149.99
        family: { price: '299.99' },
      },
      DwIcon: () => null,
      DW_ICONS: {},
      COMPARE_GROUPS: [],
    }));

    // Dynamically import with the mocked PLANS
    const { EARNINGS: mutatedEarnings } = await import('./affiliateProgram');

    // Find the proAnnual row and verify it uses the new price
    const proAnnualRow = mutatedEarnings.find((r) => r.key === 'proAnnual');
    expect(proAnnualRow.firstYearRevenue).toBe(299.99);
    expect(proAnnualRow.commission).toBeCloseTo(299.99 * 0.4, 2);

    // Verify proMonthly still uses priceMonthly and multiplies by 12
    const proMonthlyRow = mutatedEarnings.find((r) => r.key === 'proMonthly');
    expect(proMonthlyRow.firstYearRevenue).toBe(17.99 * 12);
  });
});
