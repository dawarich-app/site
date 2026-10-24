import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/components/TimelineMapV2.json';
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './TimelineMapV2';
vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

describe('TimelineMapV2 locale content', () => {
  it('renders the English content label', () => {
    render(<Subject day={null} />);
    expect(screen.getAllByText(content.unavailableTitle)[0]).toHaveTextContent(content.unavailableTitle);
  });
});
