/**
 * Consent gating for the tags that write to a visitor's device.
 *
 * Simple Analytics and Rybbit are cookieless and stay outside this module —
 * they need no consent under § 25(2) TTDSG. Everything here does.
 *
 * The Google tag is a special case. It has to be present on the page before
 * the visitor clicks anything, because the cross-domain linker can only
 * rewrite outbound links to my.dawarich.app while it is loaded — that is why
 * an earlier attempt to gate it by not loading it (e9f3291) was reverted for
 * attribution (cef12e7). Consent Mode resolves the conflict: the tag loads in
 * a denied state where it writes no cookies, and `url_passthrough` carries the
 * gclid on the URL instead, so attribution survives a refusal.
 */

export const CONSENT_COOKIE_NAME = 'dawarichCookieConsent';
export const GOOGLE_ADS_ID = 'AW-17899851408';
export const LINKER_DOMAINS = ['dawarich.app', 'my.dawarich.app'];

export const DENIED_CONSENT = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
};

export const GRANTED_CONSENT = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
};

const BREVO_CLIENT_KEY = 'pe4hklelof20ofjrbum6bcx8';
const PARTNERO_PROGRAM_ID = '1NNVU1NU';

/**
 * The inline script that runs in <head> ahead of the Google tag loader.
 *
 * It must stay self-contained: it is serialised into the document by
 * docusaurus.config.js and executes before any bundle has loaded, so it cannot
 * import anything. Consent has to be resolved here rather than in React —
 * hydration happens long after the tag would otherwise have written a cookie.
 */
export function buildConsentBootstrapScript() {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', ${JSON.stringify(DENIED_CONSENT)});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);
try {
  if (document.cookie.split('; ').indexOf('${CONSENT_COOKIE_NAME}=true') !== -1) {
    gtag('consent', 'update', ${JSON.stringify(GRANTED_CONSENT)});
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}', {
  send_page_view: false,
  linker: { domains: ${JSON.stringify(LINKER_DOMAINS)} }
});
`.trim();
}

function pushConsent(state) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(['consent', 'update', state]);
}

export function hasAcceptedConsent() {
  if (typeof document === 'undefined') return false;
  return document.cookie.split('; ').indexOf(`${CONSENT_COOKIE_NAME}=true`) !== -1;
}

export function grantGoogleConsent() {
  pushConsent(GRANTED_CONSENT);
}

export function denyGoogleConsent() {
  pushConsent(DENIED_CONSENT);
}

let integrationsLoaded = false;

export function resetConsentedIntegrationsForTest() {
  integrationsLoaded = false;
}

/**
 * Brevo and Partnero both write to the device with no denied mode to fall back
 * on, so unlike the Google tag they are not loaded at all until consent.
 *
 * Idempotent because it runs from two places: the Accept click, and mount for
 * a visitor who accepted on an earlier visit. react-cookie-consent fires
 * `onAccept` only on the click itself, so without the mount path a returning
 * visitor's stored consent was never honoured.
 */
export function loadConsentedIntegrations() {
  if (typeof document === 'undefined' || integrationsLoaded) return;
  integrationsLoaded = true;

  const brevoScript = document.createElement('script');
  brevoScript.src = 'https://cdn.brevo.com/js/sdk-loader.js';
  brevoScript.async = true;
  brevoScript.onload = () => {
    window.Brevo = window.Brevo || [];
    window.Brevo.push(['init', { client_key: BREVO_CLIENT_KEY }]);
  };
  document.head.appendChild(brevoScript);

  // Partnero's queue stub has to exist before its script is appended, so calls
  // made while it downloads are replayed rather than thrown away.
  window.__partnerObject = 'po';
  function partneroQueue() {
    const call = { a: arguments, q: [] };
    const pushed = this.push(call);
    return typeof pushed !== 'number' ? pushed : partneroQueue.bind(call.q);
  }
  partneroQueue.q = partneroQueue.q || [];
  window.po = window.po || partneroQueue.bind(partneroQueue.q);
  window.po.q = window.po.q || partneroQueue.q;

  const partneroScript = document.createElement('script');
  partneroScript.src = `https://app.partnero.com/js/universal.js?v${~~(Date.now() / 1e6)}`;
  partneroScript.async = true;
  document.head.appendChild(partneroScript);

  window.po('settings', 'assets_host', 'https://assets.partnero.com');
  window.po('program', PARTNERO_PROGRAM_ID, 'load');
}
