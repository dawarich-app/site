import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './map-poster-maker';

vi.mock('@locale-content/tools/map-poster-maker.json', async () => {
  const en = await vi.importActual('@locale-content/tools/map-poster-maker.json');
  return { default: { ...en.default, h1: 'Locale content sentinel map-poster-maker', faq: [{ q: 'Locale FAQ question', a: '**Locale FAQ answer**' }] } };
});

describe('map-poster-maker content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject  />);
    expect(screen.getAllByText('Locale content sentinel map-poster-maker')[0]).toBeInTheDocument();
    expect(screen.getByText('Locale FAQ question').closest('details')).toHaveTextContent('Locale FAQ answer');
    const faq = [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)).find(schema => schema['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(1);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe('Locale FAQ answer');
  });
});
