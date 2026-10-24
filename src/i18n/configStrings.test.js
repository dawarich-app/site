import { describe, it, expect } from 'vitest';
import { configString } from './configStrings';

describe('configString', () => {
  it('should return the English string with placeholders filled', () => {
    expect(configString('en', 'copyright', { year: 2026 })).toBe('Copyright © 2026 Dawarich');
    expect(configString('en', 'googleSignIn')).toBe('Sign in with Google');
  });

  it('should fall back to English when a locale has no config strings yet', () => {
    expect(configString('xx', 'googleSignIn')).toBe('Sign in with Google');
  });
});
