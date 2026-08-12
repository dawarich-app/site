/**
 * UTM Parameter Preservation Utility
 *
 * COMPLETELY preserves original UTM parameters from external sources.
 * External UTM params are NEVER overridden - they take absolute priority.
 *
 * How it works:
 * 1. User arrives from external source (e.g., Google Ads) with UTM params → saved to localStorage
 * 2. User clicks any CTA button on the site → external UTM params are used instead
 * 3. If no external UTM params exist, internal UTM params work normally
 *
 * This solution is UNIVERSAL - it automatically applies to all external links on the site.
 *
 * It also carries the Partnero affiliate key (`via`) to the app. PartneroJS stores
 * that key in a first-party cookie scoped to dawarich.app, which is never sent to
 * my.dawarich.app where signup happens — the same subdomain gap the gtag linker in
 * docusaurus.config.js works around for gclid. Appending `via` to outbound links lets
 * PartneroJS on the app re-read it from the URL and set its own cookie there.
 */

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_KEY = 'original_utm_params';
const STORAGE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

const REFERRAL_PARAM = 'via';
const REFERRAL_STORAGE_KEY = 'partnero_referral';
// Keep at or above the cookie lifetime configured in the Partnero program, otherwise
// the site stops forwarding a key that Partnero would still have honoured.
const REFERRAL_STORAGE_DURATION = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

/**
 * Get UTM parameters from URL
 */
function getUtmParamsFromUrl() {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const utmParams = {};

  UTM_PARAMS.forEach(param => {
    const value = params.get(param);
    if (value) {
      utmParams[param] = value;
    }
  });

  return utmParams;
}

/**
 * Save original UTM parameters to localStorage with timestamp
 */
export function saveOriginalUtmParams() {
  if (typeof window === 'undefined') return;

  const utmParams = getUtmParamsFromUrl();

  // Only save if there are UTM parameters and none are saved yet
  if (Object.keys(utmParams).length > 0) {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (!existing) {
      const data = {
        params: utmParams,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }
}

/**
 * Save the Partnero affiliate key from the URL.
 *
 * Unlike UTM params this is last-touch: a visitor arriving through a newer affiliate
 * link overwrites the stored key. Partnero owns the attribution rule and computes
 * commissions from its own cookie, so the site forwards whichever key the visitor
 * actually arrived with rather than imposing a first-touch policy Partnero never saw.
 */
export function saveReferralKey() {
  if (typeof window === 'undefined') return;

  const key = new URLSearchParams(window.location.search).get(REFERRAL_PARAM);
  if (!key) return;

  localStorage.setItem(
    REFERRAL_STORAGE_KEY,
    JSON.stringify({ key, timestamp: Date.now() })
  );
}

/**
 * Get the stored Partnero affiliate key, or null if absent or expired
 */
export function getReferralKey() {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(REFERRAL_STORAGE_KEY);
    if (!stored) return null;

    const data = JSON.parse(stored);

    if (Date.now() - data.timestamp > REFERRAL_STORAGE_DURATION) {
      localStorage.removeItem(REFERRAL_STORAGE_KEY);
      return null;
    }

    return data.key || null;
  } catch (e) {
    return null;
  }
}

/**
 * Clear the stored Partnero affiliate key (useful for testing or user logout)
 */
export function clearReferralKey() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFERRAL_STORAGE_KEY);
  }
}

/**
 * Get saved original UTM parameters if still valid
 */
function getOriginalUtmParams() {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const data = JSON.parse(stored);
    const age = Date.now() - data.timestamp;

    // Clear if expired
    if (age > STORAGE_DURATION) {
      localStorage.removeItem(STORAGE_KEY);
      return {};
    }

    return data.params || {};
  } catch (e) {
    return {};
  }
}

/**
 * Build URL with preserved UTM parameters
 *
 * Strategy:
 * - If user came from external source with UTM params, ALWAYS use those (100% preservation)
 * - Only use internal UTM params if there are NO saved external params
 * - This ensures external attribution is NEVER lost or overridden
 *
 * @param {string} urlString - The URL to append params to
 * @returns {string} URL with UTM parameters
 */
export function buildOutboundUrl(urlString) {
  if (typeof window === 'undefined') return urlString;

  try {
    const url = new URL(urlString);
    const originalUtm = getOriginalUtmParams();

    // If we have original UTM params from external source, use ONLY those
    if (Object.keys(originalUtm).length > 0) {
      // Remove all existing UTM params from the URL
      UTM_PARAMS.forEach(param => url.searchParams.delete(param));

      // Add ONLY the original external UTM params (complete preservation)
      Object.entries(originalUtm).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });
    }
    // If no original params exist, keep the internal UTM params as-is
    // (they're already in the URL - no changes needed)

    // A `via` already on the link is an explicit choice by whoever authored it
    // and outranks the stored key.
    const referralKey = getReferralKey();
    if (referralKey && !url.searchParams.has(REFERRAL_PARAM)) {
      url.searchParams.set(REFERRAL_PARAM, referralKey);
    }

    return url.toString();
  } catch (e) {
    return urlString;
  }
}

/**
 * Initialize global UTM preservation
 * This automatically handles ALL links on the page
 */
export function initializeUtmPreservation() {
  if (typeof window === 'undefined') return;

  // Save UTM params and any affiliate key on page load
  saveOriginalUtmParams();
  saveReferralKey();

  // Intercept all clicks on external links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Rewrite external links carrying UTM params, and any external link at all once
    // an affiliate key is stored — CTAs without utm_ still need to carry `via`.
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const hasUtmParams = href.includes('utm_');

    if (isExternal && (hasUtmParams || getReferralKey())) {
      const newHref = buildOutboundUrl(href);
      if (newHref !== href) {
        link.setAttribute('href', newHref);
      }
    }
  }, true); // Use capture phase to catch it early
}

/**
 * Clear saved UTM parameters (useful for testing or user logout)
 */
export function clearOriginalUtmParams() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
