import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './VisitRow';

vi.mock('@locale-content/components/VisitRow.json', async () => {
  const en = await vi.importActual('@locale-content/components/VisitRow.json');
  return { default: { ...en.default, allDay: 'Locale content sentinel VisitRow' } };
});

describe('VisitRow content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject entry={{ duration: 1440, pointCount: 2, name: "Visit" }} />);
    expect(screen.getAllByText('Locale content sentinel VisitRow')[0]).toBeInTheDocument();
  });
});
