import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ToolGuide from './ToolGuide';

const content = {
  whenToConvert: { subject: 'GPX to KML', body: ['Why.'] },
  preservation: { intro: 'What survives:', rows: [{ field: 'Elevation', preserved: 'Yes', notes: 'Metres' }] },
  apps: { intro: 'Open it in:', items: [{ name: 'QGIS', url: 'https://qgis.org/', note: 'Desktop GIS' }, { name: 'Dawarich', url: '/import-export/', note: 'Import it' }] },
  example: { intro: 'Example:', fromLabel: 'GPX', toLabel: 'KML', input: '<gpx/>', output: '<kml/>' },
  faqs: [{ q: 'Lossless?', a: 'Mostly.' }],
};

describe('ToolGuide', () => {
  it('should render the section headings around the editorial content', () => {
    render(<ToolGuide slug="gpx-to-kml" title="GPX to KML Converter" content={content} />);
    const headings = screen.getAllByRole('heading').map((h) => h.textContent);
    expect(headings).toEqual([
      "When you'd convert GPX to KML",
      "What gets preserved (and what doesn't)",
      'Apps that read your converted file',
      'Worked example',
      'Input (GPX)',
      'Output (KML)',
      'Frequently asked questions',
    ]);
    expect(screen.getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Field', 'Preserved?', 'Notes']);
  });

  it('should open external app links in a new tab and keep internal ones in the site', () => {
    render(<ToolGuide slug="gpx-to-kml" title="GPX to KML Converter" content={content} />);
    expect(screen.getByRole('link', { name: 'QGIS' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'Dawarich' })).toHaveAttribute('href', '/import-export/');
  });

  it('should emit breadcrumb JSON-LD with the tool URL', () => {
    render(<ToolGuide slug="gpx-to-kml" title="GPX to KML Converter" content={content} />);
    const blocks = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent));
    const crumbs = blocks.find((b) => b['@type'] === 'BreadcrumbList').itemListElement;
    expect(crumbs.map((c) => [c.name, c.item])).toEqual([
      ['Home', 'https://dawarich.app/'],
      ['Free Tools', 'https://dawarich.app/tools/'],
      ['GPX to KML Converter', 'https://dawarich.app/tools/gpx-to-kml/'],
    ]);
  });
});
