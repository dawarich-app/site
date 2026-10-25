import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import content from '@locale-content/tools/visited-countries-map.json';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

const square = (x0, y0, x1, y1) => [[[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]]];
const WORLD = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { id: 'DE', iso: 'DE', name: 'Germany', continent: 'Europe' }, geometry: { type: 'MultiPolygon', coordinates: square(6, 47, 15, 55) } },
    { type: 'Feature', properties: { id: 'FR', iso: 'FR', name: 'France', continent: 'Europe' }, geometry: { type: 'MultiPolygon', coordinates: square(-5, 42, 6, 47) } },
  ],
};

const gpx = `<?xml version="1.0"?><gpx version="1.1" creator="test"><trk><trkseg>
<trkpt lat="51.34" lon="12.37"><time>2024-05-01T10:00:00Z</time></trkpt>
<trkpt lat="51.35" lon="12.38"><time>2024-05-02T10:00:00Z</time></trkpt>
<trkpt lat="45.0" lon="2.0"><time>2024-05-03T10:00:00Z</time></trkpt>
</trkseg></trk></gpx>`;

import Subject from './visited-countries-map';

describe('visited countries map page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => WORLD })));
  });

  it('should list the countries found in an uploaded GPX file', async () => {
    render(<Subject />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.h1);
    const file = Object.assign(new File([gpx], 'trip.gpx', { type: 'application/gpx+xml' }), { text: async () => gpx });
    fireEvent.change(screen.getByLabelText(content.upload.inputLabel), { target: { files: [file] } });
    await waitFor(() => expect(screen.getByText('2 countries and territories')).toBeInTheDocument());
    const items = screen.getAllByRole('listitem').map((li) => li.textContent);
    expect(items.some((t) => t.startsWith('Germany') && t.includes('2 days'))).toBe(true);
    expect(items.some((t) => t.startsWith('France') && t.includes('1 day') && !t.includes('1 days') && !t.includes('–'))).toBe(true);
    expect(fetch).toHaveBeenCalledWith('/data/countries-50m.json');
  });
});
