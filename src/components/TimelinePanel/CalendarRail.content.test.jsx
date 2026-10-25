import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './CalendarRail';

vi.mock('@locale-content/components/CalendarRail.json', async () => {
  const en = await vi.importActual('@locale-content/components/CalendarRail.json');
  return { default: { ...en.default, yearLabel: 'Locale content sentinel CalendarRail' } };
});

describe('CalendarRail content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject yearStats={new Map()} searchQuery="" />);
    expect(screen.getAllByText('Locale content sentinel CalendarRail')[0]).toBeInTheDocument();
  });
});
