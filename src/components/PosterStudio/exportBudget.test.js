import { describe, expect, it } from 'vitest';
import {
  clampDpiForBudget,
  DESKTOP_AREA_BUDGET_PX,
  detectAreaBudget,
  IOS_AREA_BUDGET_PX,
  isAppleMobileDevice,
  isCanvasBlank,
} from './exportBudget';
import { layoutById } from '../../lib/poster-studio/data/layouts';

describe('isAppleMobileDevice', () => {
  it('detects iPhone and iPad user agents', () => {
    expect(
      isAppleMobileDevice({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', maxTouchPoints: 5 }),
    ).toBe(true);
    expect(
      isAppleMobileDevice({ userAgent: 'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X)', maxTouchPoints: 5 }),
    ).toBe(true);
  });

  it('detects iPadOS masquerading as Macintosh via touch points', () => {
    expect(
      isAppleMobileDevice({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', maxTouchPoints: 5 }),
    ).toBe(true);
    expect(
      isAppleMobileDevice({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', maxTouchPoints: 0 }),
    ).toBe(false);
  });

  it('maps device class onto the area budgets', () => {
    expect(detectAreaBudget({ userAgent: 'iPhone', maxTouchPoints: 5 })).toBe(IOS_AREA_BUDGET_PX);
    expect(detectAreaBudget({ userAgent: 'Windows NT 10.0', maxTouchPoints: 0 })).toBe(
      DESKTOP_AREA_BUDGET_PX,
    );
  });
});

describe('clampDpiForBudget', () => {
  const p70x100 = layoutById('print-70x100');

  it('leaves print-70x100 at 300 dpi under the desktop budget', () => {
    const result = clampDpiForBudget(p70x100, 300, DESKTOP_AREA_BUDGET_PX);
    expect(result).toMatchObject({ dpi: 300, areaClamped: false });
  });

  it('steps print-70x100 down under the iOS budget to fit the area', () => {
    const result = clampDpiForBudget(p70x100, 300, IOS_AREA_BUDGET_PX);
    expect(result.areaClamped).toBe(true);
    expect(result.dpi).toBeLessThan(300);
    expect(result.dpi).toBeGreaterThan(0);
    const widthPx = Math.round((700 / 25.4) * result.dpi);
    const heightPx = Math.round((1000 / 25.4) * result.dpi);
    expect(widthPx * heightPx).toBeLessThanOrEqual(IOS_AREA_BUDGET_PX);
  });

  it('keeps every pixel layout inside even the iOS budget untouched', () => {
    for (const id of ['social-story', 'wallpaper-4k', 'wallpaper-tablet']) {
      const layout = layoutById(id);
      const result = clampDpiForBudget(layout, 0, IOS_AREA_BUDGET_PX);
      expect(result).toMatchObject({ dpi: 0, areaClamped: false });
      expect(layout.width * layout.height).toBeLessThanOrEqual(IOS_AREA_BUDGET_PX);
    }
  });
});

describe('isCanvasBlank', () => {
  function fakeCanvas(pixelAt) {
    return {
      width: 100,
      height: 100,
      getContext: () => ({
        getImageData: (x, y) => ({ data: pixelAt(x, y) }),
      }),
    };
  }

  it('flags a canvas whose every sample is identical', () => {
    const canvas = fakeCanvas(() => Uint8ClampedArray.from([0, 0, 0, 0]));
    expect(isCanvasBlank(canvas)).toBe(true);
  });

  it('passes a canvas with any pixel variation', () => {
    const canvas = fakeCanvas((x, y) =>
      x > 50 && y > 50
        ? Uint8ClampedArray.from([255, 0, 0, 255])
        : Uint8ClampedArray.from([255, 255, 255, 255]),
    );
    expect(isCanvasBlank(canvas)).toBe(false);
  });

  it('treats an unavailable 2d context as blank', () => {
    expect(isCanvasBlank({ width: 10, height: 10, getContext: () => null })).toBe(true);
  });
});
