import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './ShareableCard';

vi.mock('@locale-content/components/ShareableCard.json', async () => {
  const en = await vi.importActual('@locale-content/components/ShareableCard.json');
  return { default: { ...en.default, title: 'Locale content sentinel ShareableCard' } };
});

describe('ShareableCard content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject stats={{ totalDistanceKm: 3, totalPoints: 2, uniquePlacesCount: 1, countries: [] }} />);
    expect(screen.getAllByText('Locale content sentinel ShareableCard')[0]).toBeInTheDocument();
  });
});
