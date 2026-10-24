import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/components/ShareableCard.json';
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './ShareableCard';

describe('ShareableCard locale content', () => {
  it('renders the English content label', () => {
    render(<Subject stats={{ totalDistanceKm: 3, totalPoints: 2, uniquePlacesCount: 1, countries: [] }} />);
    expect(screen.getAllByText(content.title)[0]).toHaveTextContent(content.title);
  });
});
