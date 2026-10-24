import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/tools/google-timeline-converter.json';

vi.mock('@site/src/components/FileUploader', () => ({ default: () => <div data-testid="uploader" /> }));
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));

import GoogleTimelineConverter from './google-timeline-converter';

describe('GoogleTimelineConverter page', () => {
  it('should render the heading and FAQ from the locale content file', () => {
    render(<GoogleTimelineConverter />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(content.h1);
    expect(document.querySelectorAll('details')).toHaveLength(content.faq.length);
    expect(screen.getByText(content.faq[0].q)).toBeInTheDocument();
  });

  it('should render inline links from content markup', () => {
    render(<GoogleTimelineConverter />);
    expect(screen.getByRole('link', { name: 'takeout.google.com' })).toHaveAttribute('target', '_blank');
    expect(screen.getAllByRole('link', { name: 'Google Timeline Visualizer' })[0]).toHaveAttribute(
      'href',
      '/tools/timeline-visualizer',
    );
  });

  it('should not hardcode a canonical link', () => {
    render(<GoogleTimelineConverter />);
    expect(document.querySelector('link[rel="canonical"]')).toBeNull();
  });
});
