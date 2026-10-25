import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RelatedTools from './RelatedTools';

describe('RelatedTools', () => {
  it('should render the heading and each related link with its note', () => {
    render(<RelatedTools slug="gpx-to-kml" />);
    expect(screen.getByRole('heading', { name: 'Related tools & pages' })).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /KML to GPX/ });
    expect(link).toHaveAttribute('href', '/tools/kml-to-gpx/');
    expect(link).toHaveTextContent('Reverse direction');
  });

  it('should link English-only pages through the English site', () => {
    render(<RelatedTools slug="photo-geotagging" />);
    expect(screen.getByRole('link', { name: /PhotoTagger CLI/ })).toHaveAttribute('href', '/docs/tools/phototagger/');
  });

  it('should render nothing for an unknown tool', () => {
    const { container } = render(<RelatedTools slug="nope" />);
    expect(container).toBeEmptyDOMElement();
  });
});
