import { describe, it, expect } from 'vitest';
import {
  dayNumber,
  dayTotal,
  formatClockDate,
  formatDateRange,
  formatShortDate,
  splitDistance,
} from './hudFormat';

const ts = (y, mo, d, h = 0, mi = 0) => new Date(y, mo, d, h, mi).getTime();

describe('splitDistance', () => {
  it('splits value and unit for the big counter', () => {
    expect(splitDistance(64820, 'km')).toEqual({ value: '64.8', unit: 'km' });
    expect(splitDistance(850, 'km')).toEqual({ value: '850', unit: 'm' });
    expect(splitDistance(12345, 'mi')).toEqual({ value: '7.7', unit: 'mi' });
  });
});

describe('clock dates', () => {
  it('formats the playhead timestamp like the design', () => {
    expect(formatClockDate(ts(2026, 5, 14, 8, 41))).toBe('14 JUN 2026 · 08:41');
  });

  it('formats short dates for the progress row', () => {
    expect(formatShortDate(ts(2026, 5, 8))).toBe('08 JUN');
  });

  it('collapses date ranges by shared month and year', () => {
    expect(formatDateRange(ts(2026, 5, 8), ts(2026, 5, 26))).toBe('08 — 26 JUN 2026');
    expect(formatDateRange(ts(2026, 4, 28), ts(2026, 5, 12))).toBe('28 MAY — 12 JUN 2026');
    expect(formatDateRange(ts(2025, 11, 28), ts(2026, 0, 3))).toBe('28 DEC 2025 — 03 JAN 2026');
    expect(formatDateRange(ts(2026, 5, 14), ts(2026, 5, 14))).toBe('14 JUN 2026');
  });
});

describe('day counters', () => {
  it('numbers days the way the design does (start day + 6 → DAY 06)', () => {
    const start = ts(2026, 5, 8, 9, 30);
    expect(dayNumber(start, ts(2026, 5, 14, 8, 41))).toBe(6);
    expect(dayNumber(start, start)).toBe(1);
    expect(dayTotal(start, ts(2026, 5, 26, 7, 0))).toBe(18);
    expect(dayTotal(start, start)).toBe(1);
  });
});
