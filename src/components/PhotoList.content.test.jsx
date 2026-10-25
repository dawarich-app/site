import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './PhotoList';

vi.mock('@locale-content/components/PhotoList.json', async () => {
  const en = await vi.importActual('@locale-content/components/PhotoList.json');
  return { default: { ...en.default, title: 'Locale content sentinel PhotoList' } };
});

describe('PhotoList content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject photos={[]} />);
    expect(screen.getAllByText('Locale content sentinel PhotoList')[0]).toBeInTheDocument();
  });
});
