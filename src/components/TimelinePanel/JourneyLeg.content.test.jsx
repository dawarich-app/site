import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './JourneyLeg';

vi.mock('@locale-content/components/JourneyLeg.json', async () => {
  const en = await vi.importActual('@locale-content/components/JourneyLeg.json');
  return { default: { ...en.default, verbs: { ...en.default.verbs, walking: 'Locale content sentinel JourneyLeg' } } };
});

describe('JourneyLeg content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject entry={{ dominantMode: "walking", duration: 60 }} />);
    expect(screen.getAllByText('Locale content sentinel JourneyLeg')[0]).toBeInTheDocument();
  });
});
