import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import CookiePreferences from './CookiePreferences';
import { CONSENT_COOKIE_NAME, hasAcceptedConsent } from '@site/src/utils/consent';

function clearConsentCookie() {
  document.cookie = `${CONSENT_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

beforeEach(() => {
  clearConsentCookie();
  window.dataLayer = [];
});

afterEach(cleanup);

describe('CookiePreferences', () => {
  // Docusaurus prerenders this page, and the prerender cannot read a cookie. A
  // visitor without JavaScript never gets past that first render, so it has to
  // carry the manual instruction rather than an empty gap under the heading.
  it('prerenders the manual instruction rather than nothing', () => {
    const html = renderToString(<CookiePreferences />);

    expect(html).toContain('dawarichCookieConsent');
    expect(html).not.toContain('Withdraw consent');
  });

  it('offers a withdrawal control to a visitor who accepted', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    render(<CookiePreferences reload={vi.fn()} />);

    expect(screen.getByRole('button', { name: /withdraw consent/i })).toBeTruthy();
  });

  // Offering to withdraw something that was never given, and then confirming it
  // was switched "off again", tells the visitor their data was being collected.
  it('offers nothing to withdraw while the banner is still unanswered', () => {
    render(<CookiePreferences reload={vi.fn()} />);

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText(/still waiting for your answer/i)).toBeTruthy();
  });

  // The banner shows itself only while its cookie is absent, so a decline is
  // otherwise a one-way door — withdrawing would be one click and reconsidering
  // would mean deleting a cookie by hand.
  it('lets a visitor who declined reopen the choice', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=false; path=/`;
    render(<CookiePreferences reload={vi.fn()} />);

    expect(screen.queryByRole('button', { name: /withdraw consent/i })).toBeNull();
    expect(screen.getByRole('button', { name: /choose again/i })).toBeTruthy();
  });

  it('clears the decline and reloads so the banner returns', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=false; path=/`;
    const reload = vi.fn();
    render(<CookiePreferences reload={reload} />);
    fireEvent.click(screen.getByRole('button', { name: /choose again/i }));

    expect(document.cookie.includes(`${CONSENT_COOKIE_NAME}=false`)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('clears the stored consent when clicked', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    render(<CookiePreferences reload={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /withdraw consent/i }));

    expect(hasAcceptedConsent()).toBe(false);
  });

  it('re-denies Google storage in the live tag rather than only on next load', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    render(<CookiePreferences reload={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /withdraw consent/i }));

    const update = window.dataLayer.map((a) => Array.from(a)).find((c) => c[1] === 'update');
    expect(update[2].ad_storage).toBe('denied');
  });

  // The affiliate key was only stored because consent allowed it, so it has to go
  // with the consent rather than waiting for the next read to notice.
  it('drops the stored affiliate key along with the consent', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    localStorage.setItem(
      'partnero_referral',
      JSON.stringify({ key: 'abc', param: 'via', timestamp: Date.now() }),
    );
    render(<CookiePreferences reload={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /withdraw consent/i }));

    expect(localStorage.getItem('partnero_referral')).toBeNull();
  });

  // Brevo and Partnero are already executing in this page and cannot be unloaded,
  // and the banner reads its cookie only when it first mounts — which Docusaurus
  // never does again during client-side navigation. Only a reload finishes the job.
  it('reloads the page so the running tags stop and the banner asks again', () => {
    document.cookie = `${CONSENT_COOKIE_NAME}=true; path=/`;
    const reload = vi.fn();
    render(<CookiePreferences reload={reload} />);
    fireEvent.click(screen.getByRole('button', { name: /withdraw consent/i }));

    expect(reload).toHaveBeenCalledTimes(1);
  });
});
