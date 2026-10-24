import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './photo-geotagging';

vi.mock('@locale-content/tools/photo-geotagging.json', async () => {
  const en = await vi.importActual('@locale-content/tools/photo-geotagging.json');
  return { default: { ...en.default, h1: 'Locale content sentinel photo-geotagging' } };
});

describe('photo-geotagging content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject  />);
    expect(screen.getAllByText('Locale content sentinel photo-geotagging')[0]).toBeInTheDocument();
  });
});
