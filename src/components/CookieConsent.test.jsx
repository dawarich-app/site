import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CustomCookieConsent from './CookieConsent';

describe('CustomCookieConsent', () => {
  it('should explain optional cookies and offer accept and reject', async () => {
    render(<CustomCookieConsent />);
    expect((await screen.findByText('Accept')).tagName).toBe('BUTTON');
    expect(screen.getByText('Reject').tagName).toBe('BUTTON');
    expect(screen.getByText(/cookieless analytics service \(Simple Analytics\)/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn more' })).toHaveAttribute('href', '/privacy-policy#cookies');
  });
});
