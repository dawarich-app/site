import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './gpx-merger';

vi.mock('@locale-content/tools/gpx-merger.json', async () => {
  const en = await vi.importActual('@locale-content/tools/gpx-merger.json');
  return { default: { ...en.default, h1: 'Locale content sentinel gpx-merger', cards: [{ title: 'Locale guide heading', paragraphs: ['**Locale guide body**'], items: [{ body: '[Locale guide link](/tools/gps-file-splitter/)' }] }] } };
});

describe('gpx-merger content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject  />);
    expect(screen.getAllByText('Locale content sentinel gpx-merger')[0]).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Locale guide heading' })).toBeInTheDocument();
    expect(screen.getByText('Locale guide body').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'Locale guide link' })).toHaveAttribute('href', '/tools/gps-file-splitter/');
  });
});
