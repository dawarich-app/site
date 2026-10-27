import React from 'react';
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('maplibre-gl', () => ({ default: {} }));
vi.mock('../../lib/poster-studio/ui/preview', async (importOriginal) => ({
  ...(await importOriginal()),
  createPreviewMap: vi.fn(),
}));

import { layoutById } from '../../lib/poster-studio/data/layouts';
import { createPreviewMap } from '../../lib/poster-studio/ui/preview';
import PreviewMap from './PreviewMap';

let stageWidth;
let stageHeight;
let observers;
let map;

beforeEach(() => {
  stageWidth = 800;
  stageHeight = 600;
  observers = [];
  map = { on: vi.fn(), once: vi.fn(), resize: vi.fn(), remove: vi.fn() };
  createPreviewMap.mockReturnValue(map);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => stageWidth);
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(() => stageHeight);
  vi.spyOn(window, 'getComputedStyle').mockReturnValue({
    paddingLeft: '0', paddingRight: '0', paddingTop: '0', paddingBottom: '0',
    marginTop: '0', marginBottom: '0',
  });
  vi.stubGlobal('ResizeObserver', class {
    constructor(callback) {
      this.callback = callback;
      this.active = false;
      observers.push(this);
    }
    observe() { this.active = true; }
    disconnect() { this.active = false; }
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

function resizeStage(width, height) {
  stageWidth = width;
  stageHeight = height;
  act(() => {
    observers.filter((observer) => observer.active).forEach((observer) => observer.callback([]));
  });
}

function frameAspect() {
  const { width, height } = screen.getByTestId('poster-frame').style;
  return Number.parseFloat(width) / Number.parseFloat(height);
}

describe('PreviewMap resizing', () => {
  it('preserves the selected layout after window resizing or phone rotation', () => {
    const props = { style: {}, trackGeojson: { type: 'FeatureCollection', features: [] } };
    const { rerender, unmount } = render(<PreviewMap {...props} layout={layoutById('print-a3')} />);

    rerender(<PreviewMap {...props} layout={layoutById('social-ig-square')} />);
    expect(frameAspect()).toBeCloseTo(1, 2);
    resizeStage(360, 500);
    expect(frameAspect()).toBeCloseTo(1, 2);

    rerender(<PreviewMap {...props} layout={layoutById('wallpaper-4k')} />);
    expect(frameAspect()).toBeCloseTo(16 / 9, 2);
    resizeStage(900, 600);
    expect(frameAspect()).toBeCloseTo(16 / 9, 2);

    expect(createPreviewMap).toHaveBeenCalledTimes(1);
    expect(map.remove).not.toHaveBeenCalled();
    unmount();
    expect(map.remove).toHaveBeenCalledTimes(1);
    expect(observers.every((observer) => !observer.active)).toBe(true);
  });
});
