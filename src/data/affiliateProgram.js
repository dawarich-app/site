import { PLANS } from './pricingPlans';

/**
 * Affiliate program facts. Every euro amount is derived from PLANS so a price
 * change flows through instead of silently leaving this page advertising a
 * commission we no longer pay.
 */

export const COMMISSION_RATE = 0.4;
export const COOKIE_WINDOW_DAYS = 90;
export const REVIEW_PERIOD_DAYS = 14;

// /register, not the bare domain — that redirects to /login, which is the wrong
// destination for someone who does not have an account yet.
export const PORTAL_SIGNUP_URL = 'https://dawarich.partneroapp.com/register';

const euros = (price) => Number.parseFloat(price);
const commissionOn = (revenue) => Math.round(revenue * COMMISSION_RATE * 100) / 100;

const row = (key, plan, basis, firstYearRevenue, note = null) => ({
  key,
  plan,
  basis,
  firstYearRevenue,
  commission: commissionOn(firstYearRevenue),
  note,
});

export const EARNINGS = [
  row('proAnnual', 'Pro', `€${PLANS.pro.price}/year`, euros(PLANS.pro.price)),
  row(
    'proMonthly',
    'Pro',
    `€${PLANS.pro.priceMonthly}/month`,
    euros(PLANS.pro.priceMonthly) * 12,
    'Paid across 12 payments, and stops early if they cancel.'
  ),
  row('family', 'Family', `€${PLANS.family.price}/year`, euros(PLANS.family.price)),
  row('lite', 'Lite', `€${PLANS.lite.price}/year`, euros(PLANS.lite.price)),
];
