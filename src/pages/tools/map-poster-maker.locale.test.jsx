import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/tools/map-poster-maker.json';
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './map-poster-maker';

describe('map-poster-maker locale content', () => {
  it('renders the English content label', () => {
    render(<Subject  />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.h1);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
});
