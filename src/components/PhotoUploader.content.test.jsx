import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './PhotoUploader';

vi.mock('@locale-content/components/PhotoUploader.json', async () => {
  const en = await vi.importActual('@locale-content/components/PhotoUploader.json');
  return { default: { ...en.default, dropPhotos: 'Locale content sentinel PhotoUploader' } };
});

describe('PhotoUploader content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject onPhotosLoaded={() => {}} onClear={() => {}} />);
    expect(screen.getAllByText('Locale content sentinel PhotoUploader')[0]).toBeInTheDocument();
  });
});
