import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CONSENT_COOKIE_NAME,
  DENIED_CONSENT,
  GRANTED_CONSENT,
  buildConsentBootstrapScript,
  hasAcceptedConsent,
  readConsentChoice,
  grantGoogleConsent,
  denyGoogleConsent,
  loadConsentedIntegrations,
  revokeConsent,
} from './consent';

function clearCookies() {
  document.cookie.split('; ').forEach((c) => {
    const name = c.split('=')[0];
    if (name) document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });
}

/**
 * Run the head bootstrap the way the browser would: in a scope where `window`
 * and `document` are the jsdom globals, with a fresh dataLayer.
 */
function runBootstrap() {
  delete window.dataLayer;
  // eslint-disable-next-line no-new-func
  new Function('window', 'document', buildConsentBootstrapScript())(window, document);
  return window.dataLayer.map((args) => Array.from(args));
}

describe('consent bootstrap script', () => {
  beforeEach(clearCookies);

  it('denies every storage type by default before anything else runs', () => {
    const calls = runBootstrap();
    const first = calls[0];

    expect(first[0]).toBe('consent');
    expect(first[1]).toBe('default');
    expect(first[2]).toMatchObject(DENIED_CONSENT);
  });

  it('denies by default even when no consent cookie exists', () => {
    const calls = runBootstrap();
    const updates = calls.filter((c) => c[0] === 'consent' && c[1] === 'update');

    expect(updates).toHaveLength(0);
  });

  it('keeps consent denied when the visitor previously clicked Reject', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=false; path=/`;
    const calls = runBootstrap();
    const updates = calls.filter((c) => c[0] === 'consent' && c[1] === 'update');

    expect(updates).toHaveLength(0);
  });

  it('restores granted consent for a visitor who previously accepted', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    const calls = runBootstrap();
    const update = calls.find((c) => c[0] === 'consent' && c[1] === 'update');

    expect(update).toBeDefined();
    expect(update[2]).toMatchObject(GRANTED_CONSENT);
  });

  it('is not fooled by a different cookie whose name ends with the consent name', () => {
    document.cookie = `not_${CONSENT_COOKIE_NAME}=true; path=/`;
    const calls = runBootstrap();
    const updates = calls.filter((c) => c[0] === 'consent' && c[1] === 'update');

    expect(updates).toHaveLength(0);
  });

  it('redacts ad identifiers and passes gclid through URLs while consent is denied', () => {
    const calls = runBootstrap();
    const sets = calls.filter((c) => c[0] === 'set');

    expect(sets).toContainEqual(['set', 'ads_data_redaction', true]);
    expect(sets).toContainEqual(['set', 'url_passthrough', true]);
  });

  it('configures the tag only after consent state is established', () => {
    const calls = runBootstrap();
    const defaultIndex = calls.findIndex((c) => c[0] === 'consent' && c[1] === 'default');
    const configIndex = calls.findIndex((c) => c[0] === 'config');

    expect(defaultIndex).toBeGreaterThanOrEqual(0);
    expect(configIndex).toBeGreaterThan(defaultIndex);
  });

  it('keeps the cross-domain linker so gclid still reaches my.dawarich.app', () => {
    const calls = runBootstrap();
    const config = calls.find((c) => c[0] === 'config');

    expect(config[2].send_page_view).toBe(false);
    expect(config[2].linker.domains).toContain('my.dawarich.app');
  });
});

describe('hasAcceptedConsent', () => {
  beforeEach(clearCookies);

  it('is false with no cookie', () => {
    expect(hasAcceptedConsent()).toBe(false);
  });

  it('is false after a decline', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=false; path=/`;
    expect(hasAcceptedConsent()).toBe(false);
  });

  it('is true after an accept', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    expect(hasAcceptedConsent()).toBe(true);
  });
});

// The banner offers three outcomes, not two: a visitor who declined is in a
// different position from one who has not answered yet, and only the first of
// those needs a way back.
describe('readConsentChoice', () => {
  beforeEach(clearCookies);

  it('reports an unanswered banner', () => {
    expect(readConsentChoice()).toBe('unanswered');
  });

  it('reports an accept', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    expect(readConsentChoice()).toBe('accepted');
  });

  it('reports a decline', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=false; path=/`;
    expect(readConsentChoice()).toBe('declined');
  });

  it('treats an unrecognised value as unanswered rather than guessing', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=maybe; path=/`;
    expect(readConsentChoice()).toBe('unanswered');
  });
});

describe('runtime consent updates', () => {
  beforeEach(() => {
    clearCookies();
    window.dataLayer = [];
  });

  // gtag.js routes a dataLayer entry to its consent command table only when the
  // entry is an `arguments` object; a plain array falls into the legacy
  // method-call branch, throws, and is swallowed. Asserting the shape here is
  // the only way to tell the two apart — `Array.from` normalises both.
  it('pushes an arguments object, not an array, so gtag processes the command', () => {
    grantGoogleConsent();

    expect(Object.prototype.toString.call(window.dataLayer[0])).toBe('[object Arguments]');
  });

  // Asserted against literals rather than the exported constants, so flipping a
  // value in consent.js cannot flip the expectation with it.
  it('grants every storage type on accept', () => {
    grantGoogleConsent();
    const call = Array.from(window.dataLayer[0]);

    expect(call[0]).toBe('consent');
    expect(call[1]).toBe('update');
    expect(call[2]).toEqual({
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });

  it('re-denies every storage type on reject', () => {
    denyGoogleConsent();
    const call = Array.from(window.dataLayer[0]);

    expect(call[2]).toEqual({
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
    });
  });

  it('does not inject a second gtag loader on accept', () => {
    grantGoogleConsent();
    const loaders = document.querySelectorAll('script[src*="googletagmanager.com"]');

    expect(loaders).toHaveLength(0);
  });
});

describe('revokeConsent', () => {
  beforeEach(() => {
    clearCookies();
    window.dataLayer = [];
  });

  it('clears the stored consent so the banner asks again', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    revokeConsent();

    expect(hasAcceptedConsent()).toBe(false);
  });

  // Withdrawal that leaves the authorised cookies in place is not withdrawal.
  it('expires the cookies the consent authorised, not just the answer', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    ['_gcl_au', 'sib_cuid', 'partnero_session_uuid'].forEach((name) => {
      document.cookie = `${name}=whatever; path=/`;
    });

    revokeConsent();

    ['_gcl_au', 'sib_cuid', 'partnero_session_uuid'].forEach((name) => {
      expect(document.cookie.includes(`${name}=`)).toBe(false);
    });
  });

  // Consent authorises storage, not just cookies — §25 TTDSG covers anything
  // written to the device, so withdrawal has to reach localStorage too.
  it('expires the device storage the consent authorised', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    ['_gcl_ls', '__wpfvdk', '_wpinitialpermissionstate'].forEach((key) => {
      localStorage.setItem(key, 'whatever');
    });

    revokeConsent();

    ['_gcl_ls', '__wpfvdk', '_wpinitialpermissionstate'].forEach((key) => {
      expect(localStorage.getItem(key)).toBeNull();
    });
  });

  it('leaves storage it did not authorise alone', () => {
    localStorage.setItem('theme', 'dark');

    revokeConsent();

    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('is a safe no-op when nothing was ever stored', () => {
    expect(() => revokeConsent()).not.toThrow();
    expect(hasAcceptedConsent()).toBe(false);
  });

  it('is idempotent, so a double click does no harm', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    document.cookie = '_gcl_au=whatever; path=/';

    revokeConsent();
    revokeConsent();

    expect(hasAcceptedConsent()).toBe(false);
    expect(document.cookie.includes('_gcl_au=')).toBe(false);
    const updates = window.dataLayer.map((a) => Array.from(a)).filter((c) => c[1] === 'update');
    expect(updates.every((c) => c[2].ad_storage === 'denied')).toBe(true);
  });

  it('leaves cookies it did not authorise alone', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    document.cookie = 'docusaurus.theme=dark; path=/';

    revokeConsent();

    expect(document.cookie.includes('docusaurus.theme=dark')).toBe(true);
  });

  it('re-denies Google storage immediately rather than waiting for a reload', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    revokeConsent();
    const call = Array.from(window.dataLayer[0]);

    expect(call[1]).toBe('update');
    expect(call[2].ad_storage).toBe('denied');
  });
});

// The bootstrap runs in <head> before any bundle exists, so it cannot import
// hasAcceptedConsent and has to repeat the cookie check by hand. Nothing else
// stops the two copies drifting apart.
describe('the two consent-cookie readers agree', () => {
  beforeEach(clearCookies);

  const cases = ['true', 'false', 'TRUE', 'True', '1', 'yes', ''];

  cases.forEach((value) => {
    it(`treats a \`${value}\` cookie the same in the bootstrap and at runtime`, () => {
      document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/`;
      const grantedInBootstrap = runBootstrap().some(
        (c) => c[0] === 'consent' && c[1] === 'update' && c[2].ad_storage === 'granted',
      );

      expect(grantedInBootstrap).toBe(hasAcceptedConsent());
    });
  });

  it('only ever treats an exact "true" as consent', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=TRUE; path=/`;

    expect(hasAcceptedConsent()).toBe(false);
  });
});

describe('loadConsentedIntegrations', () => {
  beforeEach(() => {
    clearCookies();
    document.head.innerHTML = '';
    window.dataLayer = [];
    delete window.po;
  });

  it('loads Brevo and Partnero', () => {
    loadConsentedIntegrations();
    const srcs = Array.from(document.querySelectorAll('script')).map((s) => s.src);

    expect(srcs.some((s) => s.includes('brevo.com'))).toBe(true);
    expect(srcs.some((s) => s.includes('partnero.com'))).toBe(true);
  });

  it('is idempotent so a returning visitor does not double-load them', () => {
    loadConsentedIntegrations();
    loadConsentedIntegrations();
    const brevo = Array.from(document.querySelectorAll('script')).filter((s) =>
      s.src.includes('brevo.com'),
    );

    expect(brevo).toHaveLength(1);
  });

  // A hardened context can refuse the append. Marking the work done before it
  // succeeds would strand the visitor with consent given and nothing loaded.
  it('retries after a blocked append instead of latching permanently', () => {
    const append = document.head.appendChild.bind(document.head);
    const spy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementationOnce(() => {
        throw new Error('blocked by content security policy');
      });

    expect(() => loadConsentedIntegrations()).toThrow();
    spy.mockImplementation(append);
    loadConsentedIntegrations();

    const srcs = Array.from(document.querySelectorAll('script')).map((s) => s.src);
    expect(srcs.some((s) => s.includes('brevo.com'))).toBe(true);
    expect(srcs.some((s) => s.includes('partnero.com'))).toBe(true);
    spy.mockRestore();
  });

  it('retries only the tag that failed when the first one already landed', () => {
    const append = document.head.appendChild.bind(document.head);
    let calls = 0;
    const spy = vi.spyOn(document.head, 'appendChild').mockImplementation((node) => {
      calls += 1;
      if (calls === 2) throw new Error('blocked by content security policy');
      return append(node);
    });

    expect(() => loadConsentedIntegrations()).toThrow();
    spy.mockImplementation(append);
    loadConsentedIntegrations();

    const srcs = Array.from(document.querySelectorAll('script')).map((s) => s.src);
    expect(srcs.filter((s) => s.includes('brevo.com'))).toHaveLength(1);
    expect(srcs.filter((s) => s.includes('partnero.com'))).toHaveLength(1);
    spy.mockRestore();
  });
});
