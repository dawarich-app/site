import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  CONSENT_COOKIE_NAME,
  DENIED_CONSENT,
  GRANTED_CONSENT,
  buildConsentBootstrapScript,
  hasAcceptedConsent,
  grantGoogleConsent,
  denyGoogleConsent,
  loadConsentedIntegrations,
  resetConsentedIntegrationsForTest,
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

describe('runtime consent updates', () => {
  beforeEach(() => {
    clearCookies();
    window.dataLayer = [];
  });

  it('grants every storage type on accept', () => {
    grantGoogleConsent();
    const call = Array.from(window.dataLayer[0]);

    expect(call[0]).toBe('consent');
    expect(call[1]).toBe('update');
    expect(call[2]).toMatchObject(GRANTED_CONSENT);
  });

  it('re-denies every storage type on reject', () => {
    denyGoogleConsent();
    const call = Array.from(window.dataLayer[0]);

    expect(call[2]).toMatchObject(DENIED_CONSENT);
  });

  it('does not inject a second gtag loader on accept', () => {
    grantGoogleConsent();
    const loaders = document.querySelectorAll('script[src*="googletagmanager.com"]');

    expect(loaders).toHaveLength(0);
  });
});

describe('loadConsentedIntegrations', () => {
  beforeEach(() => {
    clearCookies();
    document.head.innerHTML = '';
    window.dataLayer = [];
    resetConsentedIntegrationsForTest();
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
});
