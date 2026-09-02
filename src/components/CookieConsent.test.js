import React from 'react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import CustomCookieConsent from './CookieConsent';
import { CONSENT_COOKIE_NAME, resetConsentedIntegrationsForTest } from '@site/src/utils/consent';

function setConsentCookie(value) {
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/`;
}

// The banner writes its cookie with `domain=.dawarich.app`, so expiring it
// needs the same domain attribute or the value survives into the next test and
// the banner mounts hidden.
function clearConsentCookie() {
  const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; ${expiry}`;
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; domain=.dawarich.app; ${expiry}`;
}

function loadedThirdParties() {
  return Array.from(document.querySelectorAll('script')).map((s) => s.src);
}

function consentUpdates() {
  return (window.dataLayer || [])
    .map((args) => Array.from(args))
    .filter((c) => c[0] === 'consent' && c[1] === 'update');
}

beforeEach(() => {
  clearConsentCookie();
  document.head.innerHTML = '';
  window.dataLayer = [];
  resetConsentedIntegrationsForTest();
});

afterEach(cleanup);

describe('CustomCookieConsent', () => {
  it('loads no consented tag before the visitor answers the banner', () => {
    render(<CustomCookieConsent />);

    expect(loadedThirdParties()).toHaveLength(0);
    expect(consentUpdates()).toHaveLength(0);
  });

  it('loads no consented tag for a visitor who declined', () => {
    setConsentCookie('false');
    render(<CustomCookieConsent />);

    expect(loadedThirdParties()).toHaveLength(0);
  });

  it('honours stored consent on mount for a returning visitor', () => {
    setConsentCookie('true');
    render(<CustomCookieConsent />);
    const srcs = loadedThirdParties();

    expect(srcs.some((s) => s.includes('brevo.com'))).toBe(true);
    expect(srcs.some((s) => s.includes('partnero.com'))).toBe(true);
  });

  it('grants consent and loads the tags when Accept is clicked', () => {
    render(<CustomCookieConsent />);
    fireEvent.click(screen.getByText('Accept'));

    expect(consentUpdates()[0][2].ad_storage).toBe('granted');
    expect(loadedThirdParties().some((s) => s.includes('brevo.com'))).toBe(true);
  });

  it('does not append a second Google tag loader on Accept', () => {
    render(<CustomCookieConsent />);
    fireEvent.click(screen.getByText('Accept'));

    const loaders = loadedThirdParties().filter((s) => s.includes('googletagmanager.com'));
    expect(loaders).toHaveLength(0);
  });

  it('re-denies consent and loads nothing when Reject is clicked', () => {
    render(<CustomCookieConsent />);
    fireEvent.click(screen.getByText('Reject'));

    expect(consentUpdates()[0][2].ad_storage).toBe('denied');
    expect(loadedThirdParties()).toHaveLength(0);
  });
});
