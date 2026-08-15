import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

vi.mock('@site/src/components/PersonalizedCTA', () => ({
  default: () => <div data-testid="personalized-cta" />,
}));
vi.mock('@site/src/components/SaveToAccountButton', () => ({
  default: () => <div data-testid="save-to-account" />,
}));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({
  default: ({ trackGeojson }) => (
    <div data-testid="poster-studio-stub" data-features={trackGeojson.features.length} />
  ),
}));

import MapPosterMaker from './map-poster-maker';

// This jsdom has no Blob#text(); back-fill it via FileReader for the upload test.
if (typeof Blob.prototype.text !== 'function') {
  Blob.prototype.text = function text() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(this);
    });
  };
}

const GPX_FIXTURE = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="test"><trk><trkseg>
<trkpt lat="51.3402" lon="12.3712"><time>2026-05-16T09:00:00Z</time></trkpt>
<trkpt lat="51.3411" lon="12.3725"><time>2026-05-16T09:01:00Z</time></trkpt>
<trkpt lat="51.3420" lon="12.3738"><time>2026-05-16T09:02:00Z</time></trkpt>
</trkseg></trk></gpx>`;

function uploadGpx() {
  const file = new File([GPX_FIXTURE], 'test-route.gpx', { type: 'application/gpx+xml' });
  fireEvent.change(screen.getByLabelText(/choose files/i), { target: { files: [file] } });
}

const DEMO_PAYLOAD = {
  base: { lat: 52.52, lon: 13.405, timeMs: Date.UTC(2026, 4, 1, 9, 0, 0) },
  rows: [
    [0, 0, 0],
    [90, 120, 60],
    [180, 240, 120],
    [270, 360, 180],
  ],
};

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url) => {
      if (String(url).includes('/demo/')) {
        return { ok: true, json: async () => DEMO_PAYLOAD };
      }
      return { ok: true, json: async () => ({ bg: '#fff', text: '#000' }) };
    }),
  );
});

describe('map-poster-maker page', () => {
  it('mounts the studio immediately with the demo route and the toggle on', async () => {
    render(<MapPosterMaker />);
    await waitFor(() => expect(screen.getByTestId('poster-studio-stub')).toBeInTheDocument());
    expect(Number(screen.getByTestId('poster-studio-stub').dataset.features)).toBeGreaterThan(0);
    expect(screen.getByTestId('demo-toggle')).toBeChecked();
    expect(screen.getByTestId('poster-dropzone')).toBeInTheDocument();
    expect(screen.queryByTestId('save-to-account')).toBeNull();
  });

  it('empties the track but keeps the studio when the demo toggle is switched off', async () => {
    render(<MapPosterMaker />);
    await waitFor(() => expect(screen.getByTestId('poster-studio-stub')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId('demo-toggle'));
    await waitFor(() =>
      expect(Number(screen.getByTestId('poster-studio-stub').dataset.features)).toBe(0),
    );
    expect(screen.getByTestId('demo-toggle')).not.toBeChecked();
  });

  it('replaces the demo with an uploaded GPX and shows SaveToAccount', async () => {
    render(<MapPosterMaker />);
    await waitFor(() => expect(screen.getByTestId('poster-studio-stub')).toBeInTheDocument());

    uploadGpx();
    await waitFor(() => expect(screen.getByTestId('save-to-account')).toBeInTheDocument());
    expect(Number(screen.getByTestId('poster-studio-stub').dataset.features)).toBeGreaterThan(0);
    expect(screen.queryByTestId('demo-toggle')).toBeNull();
    expect(screen.getByText(/1 file · 3 points/)).toBeInTheDocument();
  });

  it('returns to the demo via Start over', async () => {
    render(<MapPosterMaker />);
    await waitFor(() => expect(screen.getByTestId('poster-studio-stub')).toBeInTheDocument());

    uploadGpx();
    await waitFor(() => expect(screen.getByTestId('poster-start-over')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('poster-start-over'));

    expect(screen.getByTestId('demo-toggle')).toBeChecked();
    expect(screen.queryByTestId('save-to-account')).toBeNull();
    await waitFor(() =>
      expect(Number(screen.getByTestId('poster-studio-stub').dataset.features)).toBeGreaterThan(0),
    );
  });

  it('emits four parseable JSON-LD blocks with the expected schema types', () => {
    const { container } = render(<MapPosterMaker />);
    const scripts = [...container.querySelectorAll('script[type="application/ld+json"]')];
    expect(scripts).toHaveLength(4);
    const types = scripts.map((script) => JSON.parse(script.textContent)['@type']);
    expect(types).toEqual(['WebApplication', 'HowTo', 'FAQPage', 'BreadcrumbList']);
  });

  it('keeps the honest tile disclosure in the privacy FAQ', () => {
    render(<MapPosterMaker />);
    const privacy = screen.getByText('Is my location data private?').closest('details');
    expect(privacy.textContent).toContain('tiles for the area');
    expect(privacy.textContent).toContain('never uploaded');
  });

  it('renders the related-tools block for this slug', () => {
    render(<MapPosterMaker />);
    expect(screen.getByRole('navigation', { name: /related tools/i }).textContent).toContain(
      'Poster Studio in Dawarich',
    );
  });
});
