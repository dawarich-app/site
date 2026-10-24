import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './timeline-statistics';

vi.mock('@locale-content/tools/timeline-statistics.json', async () => {
  const en = await vi.importActual('@locale-content/tools/timeline-statistics.json');
  return { default: { ...en.default, h1: 'Locale content sentinel timeline-statistics', faq: [{ q: 'Locale FAQ question', a: '**Locale FAQ answer**' }], cards: [{ title: 'Locale guide heading', paragraphs: ['**Locale guide body**'], items: [{ body: '[Locale guide link](/tools/gps-file-splitter/)' }] }] } };
});

describe('timeline-statistics content source', () => {
  it('renders the label supplied by the locale module', () => {
    render(<Subject  />);
    expect(screen.getAllByText('Locale content sentinel timeline-statistics')[0]).toBeInTheDocument();
    expect(screen.getByText('Locale FAQ question').closest('details')).toHaveTextContent('Locale FAQ answer');
    const faq = [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)).find(schema => schema['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(1);
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe('Locale FAQ answer');
    expect(screen.getByRole('heading', { name: 'Locale guide heading' })).toBeInTheDocument();
    expect(screen.getByText('Locale guide body').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'Locale guide link' })).toHaveAttribute('href', '/tools/gps-file-splitter/');
  });
});
