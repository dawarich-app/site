/**
 * Consent gating for the tags that write to a visitor's device.
 *
 * Rybbit stays outside this module, but not because it stores nothing: it
 * writes a `rybbit-visitor-id` to localStorage before the banner, and the
 * decision was to disclose that in § 6 of the privacy policy rather than gate
 * it. Do not read its absence here as "it writes nothing to the device".
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
// The banner's own cookie is host-only, because react-cookie-consent v9 ignores
// a `domain` prop. The tag cookies below are not — gtag scopes `_gcl_au` to the
// registrable domain — so expiry is attempted on both scopes for every name.
export const SITE_COOKIE_DOMAIN = '.dawarich.app';

// Cookies that only exist because consent was given, and so must not outlive it.
const CONSENTED_COOKIES = [
  '_gcl_au',
  '_gcl_aw',
  '_gcl_dc',
  'sib_cuid',
  'partnero_session_uuid',
];

// The same, for the storage the tags reach for when a cookie will not do.
// § 25 TTDSG governs writing to the device, not the mechanism used to write.
// `partnero_referral` is absent on purpose: utm.js owns it, and clearing it
// there keeps utm.js -> consent.js a one-way dependency.
const CONSENTED_STORAGE_KEYS = ['_gcl_ls', '__wpfvdk', '_wpinitialpermissionstate'];
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

/**
 * gtag.js dispatches a dataLayer entry to its consent command table only when
 * the entry is an `arguments` object — an array is read as a legacy
 * "call this method path" instruction instead, throws, and is swallowed by an
 * empty catch. So the push has to go through a real gtag shim, never an array
 * literal, or the command is silently dropped and consent never changes.
 */
function pushConsent(state) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('consent', 'update', state);
}

export const CONSENT_ACCEPTED = 'accepted';
export const CONSENT_DECLINED = 'declined';
export const CONSENT_UNANSWERED = 'unanswered';

/**
 * A declined banner and an unanswered one look the same to the tags — both mean
 * denied — but only the first needs a way back, because the banner shows itself
 * again while the cookie is absent and never once it has been set.
 */
export function readConsentChoice() {
  if (typeof document === 'undefined') return CONSENT_UNANSWERED;

  const entries = document.cookie.split('; ');
  if (entries.indexOf(`${CONSENT_COOKIE_NAME}=true`) !== -1) return CONSENT_ACCEPTED;
  if (entries.indexOf(`${CONSENT_COOKIE_NAME}=false`) !== -1) return CONSENT_DECLINED;
  return CONSENT_UNANSWERED;
}

export function hasAcceptedConsent() {
  return readConsentChoice() === CONSENT_ACCEPTED;
}

export function grantGoogleConsent() {
  pushConsent(GRANTED_CONSENT);
}

export function denyGoogleConsent() {
  pushConsent(DENIED_CONSENT);
}

/**
 * Withdrawal has to be as easy as consent was to give, so this drops the stored
 * answer and re-denies straight away rather than waiting for the next load.
 * The banner reappears on the following render because its cookie is gone.
 */
function expireCookie(name) {
  const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `${name}=; path=/; ${expiry}`;
  document.cookie = `${name}=; path=/; domain=${SITE_COOKIE_DOMAIN}; ${expiry}`;
}

export function revokeConsent() {
  if (typeof document === 'undefined') return;

  expireCookie(CONSENT_COOKIE_NAME);
  CONSENTED_COOKIES.forEach(expireCookie);

  try {
    CONSENTED_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    // Storage can be unavailable or full; the cookies are already gone.
  }

  denyGoogleConsent();
}

const TAG_MARKER = 'data-consent-tag';

function alreadyLoaded(name) {
  return document.querySelector(`script[${TAG_MARKER}="${name}"]`) !== null;
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
  if (typeof document === 'undefined') return;

  if (!alreadyLoaded('brevo')) {
    const brevoScript = document.createElement('script');
    brevoScript.src = 'https://cdn.brevo.com/js/sdk-loader.js';
    brevoScript.async = true;
    brevoScript.setAttribute(TAG_MARKER, 'brevo');
    brevoScript.onload = () => {
      window.Brevo = window.Brevo || [];
      window.Brevo.push(['init', { client_key: BREVO_CLIENT_KEY }]);
    };
    document.head.appendChild(brevoScript);
  }

  if (alreadyLoaded('partnero')) return;

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
  partneroScript.setAttribute(TAG_MARKER, 'partnero');
  document.head.appendChild(partneroScript);

  window.po('settings', 'assets_host', 'https://assets.partnero.com');
  window.po('program', PARTNERO_PROGRAM_ID, 'load');
}
