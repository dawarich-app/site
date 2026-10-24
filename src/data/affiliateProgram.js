import { PLANS } from './pricingPlans';

/**
 * Affiliate program facts. Every euro amount is derived from PLANS so a price
 * change flows through instead of silently leaving this page advertising a
 * commission we no longer pay.
 */

export const COMMISSION_RATE = 0.4;
// Whole-percent form of COMMISSION_RATE, exported so pages that display the
// rate as text (affiliate page, pricing page) derive it from one place
// instead of each computing Math.round(COMMISSION_RATE * 100) themselves.
export const COMMISSION_PERCENT = Math.round(COMMISSION_RATE * 100);
export const COOKIE_WINDOW_DAYS = 90;
export const REVIEW_PERIOD_DAYS = 14;

// /register, not the bare domain — that redirects to /login, which is the wrong
// destination for someone who does not have an account yet.
export const PORTAL_SIGNUP_URL = 'https://dawarich.partneroapp.com/register';

const euros = (price) => {
  // Strip leading currency symbol (€, $, etc.) only — commas are handled below.
  const stripped = String(price).replace(/^[^\d.-]*/, '');

  // A string with both '.' and ',' is ambiguous: "1,299.99" (US: comma
  // thousands, dot decimal) and "1.299,99" (European: dot thousands, comma
  // decimal) look similar but parse to very different numbers. Refuse to
  // guess — every real price here is well under 1,000 and never needs a
  // thousands separator at all.
  if (stripped.includes('.') && stripped.includes(',')) {
    throw new Error(
      `euros() received an ambiguous price: ${JSON.stringify(price)}. A string with both '.' and ',' could be US or European formatting — pass a plain decimal number or string instead.`
    );
  }

  const cleaned = stripped.replace(/,/g, ''); // Remove thousands separators

  const num = Number.parseFloat(cleaned);

  if (!Number.isFinite(num)) {
    throw new Error(
      `euros() received invalid price: ${JSON.stringify(price)}. Expected a finite number, plain decimal string, or currency-prefixed string.`
    );
  }

  return num;
};
const commissionOn = (revenue) => Math.round(revenue * COMMISSION_RATE * 100) / 100;

const row = (key, plan, basis, firstYearRevenue, note = null) => ({
  key,
  plan,
  basis,
  firstYearRevenue,
  commission: commissionOn(firstYearRevenue),
  note,
});

const proMonthlyRevenue = euros(PLANS.pro.priceMonthly) * 12;
const proMonthlyCommission = commissionOn(proMonthlyRevenue);
// What actually lands in the dashboard on each of the 12 payments, not just
// the first-year total — derived from the row's own commission so it can
// never drift out of sync with the number shown in the "You earn" column.
const proMonthlyPerPayment = Math.round((proMonthlyCommission / 12) * 100) / 100;

export const EARNINGS = [
  row('proAnnual', 'Pro', `€${PLANS.pro.price}/year`, euros(PLANS.pro.price)),
  row(
    'proMonthly',
    'Pro',
    `€${PLANS.pro.priceMonthly}/month`,
    proMonthlyRevenue,
    `€${proMonthlyPerPayment.toFixed(2)} on each of the first 12 payments, and stops early if they cancel.`
  ),
  row('family', 'Family', `€${PLANS.family.price}/year`, euros(PLANS.family.price)),
  row('lite', 'Lite', `€${PLANS.lite.price}/year`, euros(PLANS.lite.price)),
];

// Test-only export for testing the euros() parser
export const parseEurosForTest = euros;
