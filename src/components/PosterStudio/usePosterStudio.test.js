import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, renderHook, waitFor } from '@testing-library/react';

const { mapInstances } = vi.hoisted(() => ({ mapInstances: [] }));

vi.mock('maplibre-gl', () => {
  class MockMap {
    constructor(options) {
      this.options = options;
      this.touchZoomRotate = { disableRotation: () => {} };
      this.keyboard = { disableRotation: () => {} };
      mapInstances.push(this);
    }

    on() {}

    once() {}

    off() {}

    resize() {}

    remove() {}

    setStyle() {}

    fitBounds() {}

    getCenter() {
      return { lat: 51.3402, lng: 12.3712 };
    }
  }
  return { default: { Map: MockMap } };
});

import { usePosterStudio } from './usePosterStudio';
import PosterStudioEditor from './PosterStudioEditor';

const TOKENS_BY_KEY = {
  autumn: { name: 'Autumn', bg: '#f6ede0', text: '#2f2a24' },
  noir: { name: 'Noir', bg: '#101014', text: '#e8e8ec' },
};

function themeTokens(key) {
  const base = TOKENS_BY_KEY[key] ?? { name: key, bg: '#eeeeee', text: '#111111' };
  return {
    ...base,
    water: '#88aacc',
    parks: '#99cc99',
    road_motorway: '#111111',
    road_primary: '#222222',
    road_secondary: '#333333',
    road_tertiary: '#444444',
    road_residential: '#555555',
    road_default: '#666666',
  };
}

const TRACK_FC = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [12.3712, 51.3402],
          [12.38, 51.345],
        ],
      },
    },
  ],
};

beforeEach(() => {
  mapInstances.length = 0;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) => {
      const key = /\/poster_themes\/(.+)\.json$/.exec(url)?.[1];
      return {
        ok: true,
        json: async () => themeTokens(key),
      };
    }),
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}

      unobserve() {}

      disconnect() {}
    },
  );
});

describe('usePosterStudio', () => {
  it('starts with the plan-pinned defaults', () => {
    const { result } = renderHook(() => usePosterStudio(TRACK_FC));
    expect(result.current.themeKey).toBe('autumn');
    expect(result.current.layoutId).toBe('print-a3');
    expect(result.current.dpi).toBe(300);
    expect(result.current.fontKey).toBe('oswald');
    expect(result.current.title).toBe('Berlin');
    expect(result.current.subtitle).toBe('Summer 2026');
    expect(result.current.trackColor).toBeNull();
    expect(result.current.trackOpacity).toBe(0.5);
    expect(result.current.showAttribution).toBe(true);
    expect(result.current.trackWidth).toBe(1);
  });

  it('derives a poster style embedding the track once the theme loads', async () => {
    const { result } = renderHook(() => usePosterStudio(TRACK_FC));
    await waitFor(() => expect(result.current.style).not.toBeNull());

    const style = result.current.style;
    expect(style.sources['poster-track'].data).toBe(TRACK_FC);
    const track = style.layers.find((l) => l.id === 'poster_track');
    expect(track.paint['line-color']).toBe(result.current.theme.route);
    const casing = style.layers.find((l) => l.id === 'poster_track_casing');
    expect(casing.paint['line-color']).toBe('#f6ede0');
  });

  it('applies track color, opacity and width to the derived style', async () => {
    const { result } = renderHook(() => usePosterStudio(TRACK_FC));
    await waitFor(() => expect(result.current.style).not.toBeNull());

    act(() => {
      result.current.setTrackColor('#123456');
      result.current.setTrackOpacity(0.6);
      result.current.setTrackWidth(2);
    });

    const track = result.current.style.layers.find((l) => l.id === 'poster_track');
    expect(track.paint['line-color']).toBe('#123456');
    expect(track.paint['line-opacity']).toBe(0.6);
    expect(track.paint['line-width'][4]).toBe(3);
  });

  it('reloads tokens and recolors the casing when the theme changes', async () => {
    const { result } = renderHook(() => usePosterStudio(TRACK_FC));
    await waitFor(() => expect(result.current.style).not.toBeNull());

    act(() => result.current.setThemeKey('noir'));
    await waitFor(() => expect(result.current.theme?.casing).toBe('#101014'));
    expect(fetch).toHaveBeenCalledWith('/poster_themes/noir.json');
  });

  it('resolves the layout object and switches between paper and pixel kinds', async () => {
    const { result } = renderHook(() => usePosterStudio(TRACK_FC));
    expect(result.current.layout.kind).toBe('paper');

    act(() => result.current.setLayoutId('social-story'));
    expect(result.current.layout.kind).toBe('pixels');
    expect(result.current.layout.dimensionsLabel).toBe('1080 × 1920 px');
  });

  it('surfaces theme load failures without crashing', async () => {
    const { result } = renderHook(() => usePosterStudio(TRACK_FC));
    await waitFor(() => expect(result.current.style).not.toBeNull());

    // loadThemeTokens caches per key, so fail on a key no test has fetched.
    fetch.mockImplementation(async () => ({ ok: false, status: 500 }));
    act(() => result.current.setThemeKey('emerald'));
    await waitFor(() => expect(result.current.themeError).not.toBeNull());
  });
});

describe('PosterStudioEditor smoke', () => {
  it('renders under jsdom and constructs the preview map with locked rotation and no drawing buffer', async () => {
    render(<PosterStudioEditor trackGeojson={TRACK_FC} />);
    await waitFor(() => expect(mapInstances.length).toBeGreaterThan(0));

    expect(mapInstances[0].options).toMatchObject({
      dragRotate: false,
      pitchWithRotate: false,
      preserveDrawingBuffer: false,
      attributionControl: false,
    });
    expect(mapInstances[0].options.bounds).toEqual([
      [12.3712, 51.3402],
      [12.38, 51.345],
    ]);
  });

  it('falls back to the provided bounds when the track is empty', async () => {
    const fallback = [
      [13.35, 52.49],
      [13.46, 52.55],
    ];
    render(
      <PosterStudioEditor
        trackGeojson={{ type: 'FeatureCollection', features: [] }}
        fallbackBounds={fallback}
      />,
    );
    await waitFor(() => expect(mapInstances.length).toBeGreaterThan(0));
    expect(mapInstances[mapInstances.length - 1].options.bounds).toEqual(fallback);
  });
});
