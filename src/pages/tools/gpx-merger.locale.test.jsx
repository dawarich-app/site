import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import content from '@locale-content/tools/gpx-merger.json';
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './gpx-merger';

describe('gpx-merger locale content', () => {
  it('renders the English content label', () => {
    render(<Subject  />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.h1);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });

  it('keeps point counts and the separator in singular and plural track summaries', async () => {
    render(<Subject />);
    const track = '<trk><trkseg><trkpt lat="52.5" lon="13.4" /></trkseg></trk>';
    fireEvent.change(screen.getByLabelText(content.upload.inputLabel), {
      target: { files: [
        { name: 'one.gpx', text: async () => `<gpx>${track}</gpx>` },
        { name: 'two.gpx', text: async () => `<gpx>${track}${track}</gpx>` },
      ] },
    });
    expect(await screen.findByText('1 track | 1 points')).toBeInTheDocument();
    expect(screen.getByText('2 tracks | 2 points')).toBeInTheDocument();
  });
});
