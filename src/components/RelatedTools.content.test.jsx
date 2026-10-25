import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@locale-content/shared/tool-related-links.json', () => ({
  default: { 'gpx-to-kml': [{ href: '/tools/kml-to-gpx/', label: 'KML zu GPX', note: 'Umgekehrte Richtung' }] },
}));

import RelatedTools from './RelatedTools';

describe('RelatedTools content source', () => {
  it('should render labels and notes from the locale content file', () => {
    render(<RelatedTools slug="gpx-to-kml" />);
    expect(screen.getByRole('link', { name: /KML zu GPX/ })).toHaveTextContent('Umgekehrte Richtung');
  });
});
