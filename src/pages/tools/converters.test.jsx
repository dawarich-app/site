import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import shared from '@locale-content/shared/converter.json';

vi.mock('@site/src/components/FormatConverter', () => ({ default: () => <div /> }));
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));

const slugs = [
  'fit-to-geojson', 'fit-to-gpx', 'fit-to-kml',
  'geojson-to-gpx', 'geojson-to-kml', 'geojson-to-kmz',
  'gpx-to-geojson', 'gpx-to-kml', 'gpx-to-kmz',
  'kml-to-geojson', 'kml-to-gpx', 'kml-to-kmz',
  'kmz-to-geojson', 'kmz-to-gpx', 'kmz-to-kml',
  'tcx-to-geojson', 'tcx-to-gpx', 'tcx-to-kml',
];
const pages = import.meta.glob('./*-to-*.js');
const contents = import.meta.glob('../../i18n/content/en/tools/*-to-*.json', { eager: true, import: 'default' });

describe.each(slugs)('%s locale content', (slug) => {
  const content = contents[`../../i18n/content/en/tools/${slug}.json`];
  const renderPage = async () => {
    const { default: Page } = await pages[`./${slug}.js`]();
    return render(<Page />);
  };

  it('renders locale heading and shared privacy copy with site-managed canonical metadata', async () => {
    await renderPage();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(content.h1);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
    expect(screen.getByText(shared.privacyTitle)).toBeInTheDocument();
  });
});
