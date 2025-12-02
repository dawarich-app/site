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
 */

const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const STORAGE_KEY = 'original_utm_params';
const STORAGE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

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
export function buildUrlWithUtm(urlString) {
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

  // Save UTM params on page load
  saveOriginalUtmParams();

  // Intercept all clicks on external links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Check if it's an external link with UTM params
    const isExternal = href.startsWith('http://') || href.startsWith('https://');
    const hasUtmParams = href.includes('utm_');

    if (isExternal && hasUtmParams) {
      // Update the href with preserved UTM params
      const newHref = buildUrlWithUtm(href);
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
