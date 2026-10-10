import { beforeEach, describe, expect, it } from 'vitest';
import {
  CONSENT_COOKIE_NAME,
  GRANTED_CONSENT,
  hasAcceptedConsent,
  loadConsentedIntegrations,
  readConsentChoice,
  revokeConsent,
} from './consent';

function clearCookies() {
  document.cookie.split('; ').forEach((entry) => {
    const name = entry.split('=')[0];
    if (name) document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  });
}

function calls() {
  return (window.dataLayer || []).map((entry) => Array.from(entry));
}

beforeEach(() => {
  clearCookies();
  document.head.innerHTML = '';
  window.dataLayer = [];
  delete window.po;
});

describe('optional tracking consent', () => {
  it('treats no answer and a refusal as no consent', () => {
    expect(readConsentChoice()).toBe('unanswered');
    expect(hasAcceptedConsent()).toBe(false);
    loadConsentedIntegrations();
    expect(document.querySelectorAll('script[src]')).toHaveLength(0);
    expect(calls()).toHaveLength(0);

    document.cookie = `${CONSENT_COOKIE_NAME}=false; path=/`;
    expect(readConsentChoice()).toBe('declined');
    loadConsentedIntegrations();
    expect(document.querySelectorAll('script[src]')).toHaveLength(0);
  });

  it('loads optional scripts only after explicit consent', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    expect(readConsentChoice()).toBe('accepted');
    loadConsentedIntegrations();

    const sources = Array.from(document.querySelectorAll('script[src]'), (script) => script.src);
    expect(sources.some((src) => src.includes('googletagmanager.com/gtag/js'))).toBe(true);
    expect(sources.some((src) => src.includes('rybbit.dwri.xyz'))).toBe(true);
    expect(sources.some((src) => src.includes('brevo.com'))).toBe(true);
    expect(sources.some((src) => src.includes('partnero.com'))).toBe(true);
    expect(calls()[0]).toEqual(['consent', 'default', GRANTED_CONSENT]);
    expect(calls().find((entry) => entry[0] === 'config')[2].linker.domains).toContain('my.dawarich.app');
    expect(calls().some((entry) => entry.includes('url_passthrough'))).toBe(false);
  });

  it('does not load a second Google tag on a repeat mount', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    loadConsentedIntegrations();
    loadConsentedIntegrations();
    expect(document.querySelectorAll('script[src*="googletagmanager.com"]')).toHaveLength(1);
  });

  it('clears consented storage and denies further Google use on withdrawal', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    loadConsentedIntegrations();
    localStorage.setItem('rybbit-visitor-id', 'visitor');
    document.cookie = '_gcl_au=identifier; path=/';

    revokeConsent();

    expect(hasAcceptedConsent()).toBe(false);
    expect(localStorage.getItem('rybbit-visitor-id')).toBeNull();
    expect(document.cookie.includes('_gcl_au=')).toBe(false);
    expect(calls().at(-1)[2].ad_storage).toBe('denied');
  });
});
