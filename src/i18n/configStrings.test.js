import { describe, it, expect } from 'vitest';
import { configString, escapeHtml } from './configStrings';

describe('configString', () => {
  it('should return the English string with placeholders filled', () => {
    expect(configString('en', 'copyright', { year: 2026 })).toBe('Copyright © 2026 Dawarich');
    expect(configString('en', 'googleSignIn')).toBe('Sign in with Google');
  });

  it('should fall back to English when a locale has no config strings yet', () => {
    expect(configString('xx', 'googleSignIn')).toBe('Sign in with Google');
  });
});

describe('configString errors and escaping', () => {
  it('should name the missing key', () => {
    expect(() => configString('en', 'nope')).toThrow('Missing config string "nope"');
  });

  it('should escape HTML when asked', () => {
    expect(escapeHtml(`Tom & "Jerry" <b>'s`)).toBe('Tom &amp; &quot;Jerry&quot; &lt;b&gt;&#39;s');
  });
});
