import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@site/src/components/FileUploader', () => ({ default: () => <div /> }));
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@locale-content/tools/google-timeline-converter.json', async () => {
  const en = (await import('../../i18n/content/en/tools/google-timeline-converter.json')).default;
  return { default: { ...en, h1: 'Lokalisierter Titel', faq: [{ q: 'Frage?', a: 'Antwort.' }] } };
});

import GoogleTimelineConverter from './google-timeline-converter';

describe('GoogleTimelineConverter page content source', () => {
  it('should render whatever the locale content file provides', () => {
    render(<GoogleTimelineConverter />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Lokalisierter Titel');
    expect(screen.getByText('Frage?')).toBeInTheDocument();
    expect(document.querySelectorAll('details')).toHaveLength(1);
  });
});
