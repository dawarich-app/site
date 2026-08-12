import { describe, it, expect, beforeEach } from 'vitest';
import {
  buildOutboundUrl,
  saveOriginalUtmParams,
  clearOriginalUtmParams,
  saveReferralKey,
  getReferralKey,
  clearReferralKey,
} from './utm';

const SIGNUP = 'https://my.dawarich.app/users/sign_up';

function visit(search) {
  window.history.replaceState({}, '', `/${search}`);
}

describe('referral (via) preservation', () => {
  beforeEach(() => {
    localStorage.clear();
    clearOriginalUtmParams();
    clearReferralKey();
    visit('');
  });

  it('saves the via key when a visitor lands from a referral link', () => {
    visit('?via=PARTNER123');
    saveReferralKey();

    expect(getReferralKey()).toBe('PARTNER123');
  });

  it('appends the saved via key to an outbound signup URL', () => {
    visit('?via=PARTNER123');
    saveReferralKey();

    expect(buildOutboundUrl(SIGNUP)).toContain('via=PARTNER123');
  });

  it('appends via even when the outbound URL carries no utm params', () => {
    visit('?via=PARTNER123');
    saveReferralKey();

    const url = new URL(buildOutboundUrl('https://my.dawarich.app/users/sign_in'));
    expect(url.searchParams.get('via')).toBe('PARTNER123');
  });

  it('survives later navigation that carries no via of its own', () => {
    visit('?via=PARTNER123');
    saveReferralKey();

    visit('?utm_source=blog');
    saveReferralKey();

    expect(getReferralKey()).toBe('PARTNER123');
  });

  it('takes the newest via so Partnero decides attribution, not the site', () => {
    visit('?via=FIRST');
    saveReferralKey();

    visit('?via=SECOND');
    saveReferralKey();

    expect(getReferralKey()).toBe('SECOND');
  });

  it('leaves URLs untouched when no referral was ever seen', () => {
    expect(buildOutboundUrl(SIGNUP)).toBe(SIGNUP);
  });

  it('does not clobber an explicit via already present on the link', () => {
    visit('?via=STORED');
    saveReferralKey();

    const url = new URL(buildOutboundUrl(`${SIGNUP}?via=EXPLICIT`));
    expect(url.searchParams.get('via')).toBe('EXPLICIT');
  });

  it('preserves via and utm params together', () => {
    visit('?via=PARTNER123&utm_source=blog&utm_medium=post');
    saveReferralKey();
    saveOriginalUtmParams();

    const url = new URL(buildOutboundUrl(`${SIGNUP}?utm_source=hero`));
    expect(url.searchParams.get('via')).toBe('PARTNER123');
    expect(url.searchParams.get('utm_source')).toBe('blog');
  });

  it('drops a referral once it has aged past the retention window', () => {
    visit('?via=PARTNER123');
    saveReferralKey();

    const stored = JSON.parse(localStorage.getItem('partnero_referral'));
    stored.timestamp = Date.now() - (91 * 24 * 60 * 60 * 1000);
    localStorage.setItem('partnero_referral', JSON.stringify(stored));

    expect(getReferralKey()).toBeNull();
  });
});
