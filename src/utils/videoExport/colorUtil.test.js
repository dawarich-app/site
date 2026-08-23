import { describe, it, expect } from 'vitest';
import { DAWARICH_BLUE, hexToRgba } from './colorUtil';

describe('hexToRgba', () => {
  it('converts hex colors with an alpha', () => {
    expect(hexToRgba('#FF3B30', 1)).toBe('rgba(255, 59, 48, 1)');
    expect(hexToRgba('#ff3b30', 0.45)).toBe('rgba(255, 59, 48, 0.45)');
    expect(hexToRgba('#000000', 0)).toBe('rgba(0, 0, 0, 0)');
  });

  it('falls back to the Dawarich brand blue for malformed input', () => {
    expect(DAWARICH_BLUE).toBe('#2563EB');
    expect(hexToRgba('purple', 0.5)).toBe('rgba(37, 99, 235, 0.5)');
    expect(hexToRgba(null, 1)).toBe('rgba(37, 99, 235, 1)');
  });
});
