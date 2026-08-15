import { describe, expect, it, vi } from 'vitest';

vi.mock('maplibre-gl', () => ({ default: {} }));

import {
  DEFAULT_ROUTE_COLOR,
  extendTokens,
  resolveTheme,
  THEME_KEYS,
} from './data/theme_loader.js';
import { buildPosterStyle, TRACK_SOURCE_ID } from './render/style_builder.js';
import {
  DEFAULT_LAYOUT_ID,
  LAYOUT_CATEGORIES,
  layoutById,
  resolveLayoutGeometry,
} from './data/layouts.js';
import { DPI_PRESETS, PAPER_SIZES } from './data/paper_sizes.js';
import { ORDERABLE_LAYOUT_IDS, PRINT_PRODUCTS, printProductFor } from './data/print_products.js';
import { DEFAULT_TILE_URL, SOURCE_ID } from './data/protomaps_schema.js';
import { DEFAULT_FONT_KEY, POSTER_FONTS, fontByKey } from './data/fonts.js';
import { encodePng } from './export/png_encoder.js';
import { encodePdf } from './export/pdf_encoder.js';
import { pdfBlob, pngBlob, posterFilename } from './export/download.js';
import { formatCoords, layoutPosterText, titleShrink } from './render/text_layout.js';
import { drawOverlay, POSTER_ATTRIBUTION } from './render/overlay.js';
import { trimOutlierCoords } from './render/outliers.js';
import { submitPrintOrder } from './ui/order_client.js';
import { collectCoords, createPreviewMap, fitFrame, trackBounds } from './ui/preview.js';
import { exportPoster, studioFilename } from './ui/exporter.js';
import { captureBounds } from './render/offscreen_map.js';

const MINIMAL_TOKENS = {
  name: 'Test',
  bg: '#ffffff',
  text: '#101010',
  water: '#aaccee',
  parks: '#bbeebb',
  road_motorway: '#111111',
  road_primary: '#222222',
  road_secondary: '#333333',
  road_tertiary: '#444444',
  road_residential: '#555555',
  road_default: '#666666',
};

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

describe('theme_loader', () => {
  it('lists exactly 17 theme keys', () => {
    expect(THEME_KEYS).toHaveLength(17);
  });

  it('resolveTheme extends tokens with derived colors and defaults', () => {
    const theme = resolveTheme(MINIMAL_TOKENS);
    expect(theme.route).toBe(DEFAULT_ROUTE_COLOR);
    expect(theme.casing).toBe('#ffffff');
    expect(theme.buildings).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.railway).toBe('#666666');
    expect(theme.boundaries).toMatch(/^#[0-9a-f]{6}$/i);
    expect(theme.roads.motorway).toBe('#111111');
  });

  it('extendTokens respects explicit overrides', () => {
    const extended = extendTokens({ ...MINIMAL_TOKENS, buildings: '#123123' });
    expect(extended.buildings).toBe('#123123');
  });
});

describe('style_builder', () => {
  it('buildPosterStyle embeds the track source and styled track layers', () => {
    const theme = resolveTheme(MINIMAL_TOKENS);
    const style = buildPosterStyle({
      theme,
      trackGeojson: TRACK_FC,
      trackColor: '#123456',
      trackOpacity: 0.6,
      trackWidth: 2,
    });

    expect(style.version).toBe(8);
    expect(style.sources[SOURCE_ID].type).toBe('vector');
    expect(style.sources[TRACK_SOURCE_ID]).toEqual({ type: 'geojson', data: TRACK_FC });

    const track = style.layers.find((l) => l.id === 'poster_track');
    const casing = style.layers.find((l) => l.id === 'poster_track_casing');
    expect(track.paint['line-color']).toBe('#123456');
    expect(track.paint['line-opacity']).toBe(0.6);
    expect(track.paint['line-width'][4]).toBe(3);
    expect(casing.paint['line-color']).toBe(theme.casing);
  });

  it('falls back to the theme route color without a custom track color', () => {
    const theme = resolveTheme(MINIMAL_TOKENS);
    const style = buildPosterStyle({ theme });
    const track = style.layers.find((l) => l.id === 'poster_track');
    expect(track.paint['line-color']).toBe(theme.route);
  });
});

describe('layouts', () => {
  it('exposes 22 layouts in 3 categories with print-a3 default', () => {
    expect(DEFAULT_LAYOUT_ID).toBe('print-a3');
    expect(LAYOUT_CATEGORIES).toHaveLength(3);
    const total = LAYOUT_CATEGORIES.reduce((n, c) => n + c.layouts.length, 0);
    expect(total).toBe(22);
  });

  it('clamps pixel layouts to maxDimensionPx proportionally', () => {
    const layout = layoutById('social-story');
    const geometry = resolveLayoutGeometry(layout, 0, { maxDimensionPx: 960 });
    expect(geometry).toMatchObject({ width: 540, height: 960, steppedDown: true });
  });

  it('steps paper layouts down when the limit cuts the requested dpi', () => {
    const layout = layoutById('print-a3');
    const geometry = resolveLayoutGeometry(layout, 300, { maxDimensionPx: 1000 });
    expect(geometry.steppedDown).toBe(true);
    expect(geometry.effectiveDpi).toBeLessThan(300);
    expect(Math.max(geometry.width, geometry.height)).toBeLessThanOrEqual(1000);
  });
});

describe('png_encoder', () => {
  const rgba = new Uint8Array(2 * 2 * 4).fill(255);

  const ascii = (bytes) => new TextDecoder('latin1').decode(bytes);

  it('emits the PNG signature and a pHYs chunk for dpi > 0', () => {
    const png = encodePng(rgba, 2, 2, 300);
    expect([...png.slice(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    const text = ascii(png);
    const physAt = text.indexOf('pHYs');
    expect(physAt).toBeGreaterThan(-1);
    const view = new DataView(png.buffer, png.byteOffset + physAt + 4);
    expect(view.getUint32(0)).toBe(11811);
  });

  it('omits pHYs at dpi 0', () => {
    expect(ascii(encodePng(rgba, 2, 2, 0))).not.toContain('pHYs');
  });

  it('rejects mismatched buffer sizes', () => {
    expect(() => encodePng(rgba, 3, 3, 0)).toThrow(/does not match/);
  });
});

describe('text_layout', () => {
  it('layoutPosterText stacks title, divider, subtitle and coords lines', () => {
    const lines = layoutPosterText({
      width: 1000,
      height: 1500,
      title: 'Leipzig',
      subtitle: 'Summer 2026',
      coords: '51.3402° N / 12.3712° E',
    });
    expect(lines.titleY).toBeLessThan(lines.dividerY);
    expect(lines.dividerY).toBeLessThan(lines.subY);
    expect(lines.subY).toBeLessThan(lines.coordsY);
    expect(lines.titleSize).toBeGreaterThan(0);
  });

  it('titleShrink shrinks long titles below 1', () => {
    expect(titleShrink('Short')).toBe(1);
    expect(titleShrink('A very very long poster title')).toBeLessThan(1);
  });

  it('formatCoords renders hemisphere-aware coordinates', () => {
    expect(formatCoords({ lat: 51.3402, lng: 12.3712 })).toBe('51.3402° N / 12.3712° E');
    expect(formatCoords({ lat: -33.9249, lng: -70.6693 })).toBe('33.9249° S / 70.6693° W');
    expect(formatCoords(null)).toBe('');
  });
});

describe('outliers', () => {
  it('returns small coordinate sets untouched', () => {
    const coords = [
      [12.37, 51.34],
      [12.38, 51.35],
    ];
    expect(trimOutlierCoords(coords)).toBe(coords);
  });

  it('drops a lone far-away outlier from a dense cluster', () => {
    const coords = Array.from({ length: 80 }, (_, i) => [12.37 + i * 0.0001, 51.34 + i * 0.0001]);
    coords.push([80, 10]);
    const kept = trimOutlierCoords(coords);
    expect(kept).toHaveLength(80);
    expect(kept.every(([lng]) => lng < 13)).toBe(true);
  });
});

describe('preview helpers', () => {
  it('collectCoords flattens LineString, MultiLineString and Point features', () => {
    const fc = {
      type: 'FeatureCollection',
      features: [
        ...TRACK_FC.features,
        { type: 'Feature', geometry: { type: 'Point', coordinates: [12.4, 51.35] } },
      ],
    };
    expect(collectCoords(fc)).toHaveLength(3);
  });

  it('trackBounds returns padded bounds for a single point and null when empty', () => {
    const single = {
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [12.4, 51.35] } }],
    };
    expect(trackBounds(single)).toEqual([
      [12.4 - 0.01, 51.35 - 0.01],
      [12.4 + 0.01, 51.35 + 0.01],
    ]);
    expect(trackBounds({ type: 'FeatureCollection', features: [] })).toBeNull();
  });
});

describe('exporter', () => {
  it('studioFilename slugs the title into the download name', () => {
    const layout = layoutById('print-a3');
    expect(studioFilename('My Trip!', layout, 'png')).toBe('dawarich-my-trip-print-a3.png');
    expect(studioFilename('', layout, 'pdf')).toBe('dawarich-poster-print-a3.pdf');
    expect(studioFilename('!!!', layout, 'png')).toBe('dawarich-poster-print-a3.png');
  });
});

describe('module surface', () => {
  it('exposes the remaining vendored API', () => {
    expect(DPI_PRESETS).toEqual([96, 150, 300]);
    expect(PAPER_SIZES.A3).toBeDefined();
    expect(Object.keys(PRINT_PRODUCTS)).toEqual(['print-30x40', 'print-50x70', 'print-70x100']);
    expect(ORDERABLE_LAYOUT_IDS).toHaveLength(3);
    expect(printProductFor('print-30x40').priceLabel).toBe('€44.99');
    expect(printProductFor('social-story')).toBeNull();
    expect(DEFAULT_TILE_URL).toContain('tyles.dwri.xyz');
    expect(POSTER_FONTS).toHaveLength(4);
    expect(DEFAULT_FONT_KEY).toBe('oswald');
    expect(fontByKey('oswald')).toBeDefined();
    expect(POSTER_ATTRIBUTION).toBeTruthy();
    expect(typeof drawOverlay).toBe('function');
    expect(typeof encodePdf).toBe('function');
    expect(typeof pngBlob).toBe('function');
    expect(typeof pdfBlob).toBe('function');
    expect(typeof posterFilename).toBe('function');
    expect(typeof submitPrintOrder).toBe('function');
    expect(typeof createPreviewMap).toBe('function');
    expect(typeof fitFrame).toBe('function');
    expect(typeof exportPoster).toBe('function');
    expect(typeof captureBounds).toBe('function');
  });
});
