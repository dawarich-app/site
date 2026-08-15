import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { THEME_KEYS } from '../../lib/poster-studio/data/theme_loader';
import { usePosterStudio } from './usePosterStudio';
import ThemePicker from './ThemePicker';
import LayoutPicker from './LayoutPicker';
import TextControls from './TextControls';
import TrackControls from './TrackControls';

function Harness() {
  const studio = usePosterStudio({ type: 'FeatureCollection', features: [] });
  return (
    <div>
      <pre data-testid="state">
        {JSON.stringify({
          themeKey: studio.themeKey,
          layoutId: studio.layoutId,
          layoutKind: studio.layout.kind,
          dpi: studio.dpi,
          title: studio.title,
          subtitle: studio.subtitle,
          showCoords: studio.showCoords,
          showAttribution: studio.showAttribution,
          fontKey: studio.fontKey,
          trackColor: studio.trackColor,
          trackOpacity: studio.trackOpacity,
          trackWidth: studio.trackWidth,
        })}
      </pre>
      <ThemePicker studio={studio} />
      <LayoutPicker studio={studio} />
      <TextControls studio={studio} />
      <TrackControls studio={studio} />
    </div>
  );
}

function state() {
  return JSON.parse(screen.getByTestId('state').textContent);
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok: true, json: async () => ({ bg: '#fff', text: '#000' }) })),
  );
});

describe('ThemePicker', () => {
  it('renders all 17 chips with their thumbnail URLs and marks the selection', () => {
    render(<Harness />);
    for (const key of THEME_KEYS) {
      const chip = screen.getByTestId(`theme-chip-${key}`);
      expect(chip.style.backgroundImage).toContain(`/img/poster_themes/${key}.webp`);
    }
    expect(screen.getByTestId('theme-chip-autumn')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByTestId('theme-chip-noir')).toHaveAttribute('aria-pressed', 'false');
  });

  it('selects a theme on click', () => {
    render(<Harness />);
    fireEvent.click(screen.getByTestId('theme-chip-noir'));
    expect(state().themeKey).toBe('noir');
    expect(screen.getByTestId('theme-chip-noir')).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('LayoutPicker', () => {
  it('groups 22 layouts into print, social and wallpaper with dimension captions', () => {
    render(<Harness />);
    expect(screen.getAllByTestId(/^layout-chip-/)).toHaveLength(22);
    expect(screen.getByTestId('layout-chip-print-30x40').textContent).toContain('30 × 40 cm');
    expect(screen.getByTestId('layout-chip-social-story').textContent).toContain('1080 × 1920 px');
  });

  it('shows the DPI select for paper layouts and hides it for pixel layouts', () => {
    render(<Harness />);
    expect(screen.getByTestId('dpi-select')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('layout-chip-social-story'));
    expect(state().layoutId).toBe('social-story');
    expect(state().layoutKind).toBe('pixels');
    expect(screen.queryByTestId('dpi-select')).toBeNull();

    fireEvent.click(screen.getByTestId('layout-chip-print-a4'));
    expect(state().layoutKind).toBe('paper');
    expect(screen.getByTestId('dpi-select')).toBeInTheDocument();
  });

  it('changes dpi through the select', () => {
    render(<Harness />);
    fireEvent.change(screen.getByTestId('dpi-select'), { target: { value: '150' } });
    expect(state().dpi).toBe(150);
  });
});

describe('TextControls', () => {
  it('wires title, subtitle, coordinates toggle and font select to the hook', () => {
    render(<Harness />);
    fireEvent.change(screen.getByTestId('title-input'), { target: { value: 'Leipzig' } });
    fireEvent.change(screen.getByTestId('subtitle-input'), { target: { value: 'Summer 2026' } });
    fireEvent.click(screen.getByTestId('coords-toggle'));
    fireEvent.click(screen.getByTestId('attribution-toggle'));
    fireEvent.change(screen.getByTestId('font-select'), { target: { value: 'inter' } });

    expect(state()).toMatchObject({
      title: 'Leipzig',
      subtitle: 'Summer 2026',
      showCoords: false,
      showAttribution: false,
      fontKey: 'inter',
    });
  });
});

describe('TrackControls', () => {
  it('maps sliders to the buildPosterStyle seam values', () => {
    render(<Harness />);
    fireEvent.change(screen.getByTestId('width-slider'), { target: { value: '150' } });
    expect(state().trackWidth).toBe(1.5);

    fireEvent.change(screen.getByTestId('opacity-slider'), { target: { value: '60' } });
    expect(state().trackOpacity).toBe(0.6);
  });

  it('propagates a custom color and resets to the theme default', () => {
    render(<Harness />);
    fireEvent.change(screen.getByTestId('track-color'), { target: { value: '#123456' } });
    expect(state().trackColor).toBe('#123456');

    fireEvent.click(screen.getByTestId('track-color-reset'));
    expect(state().trackColor).toBeNull();
  });

  it('constrains the sliders to the studio ranges and steps', () => {
    render(<Harness />);
    const width = screen.getByTestId('width-slider');
    const opacity = screen.getByTestId('opacity-slider');
    expect(width).toHaveAttribute('min', '50');
    expect(width).toHaveAttribute('max', '150');
    expect(width).toHaveAttribute('step', '10');
    expect(opacity).toHaveAttribute('min', '10');
    expect(opacity).toHaveAttribute('max', '100');
    expect(opacity).toHaveAttribute('step', '5');
  });
});
