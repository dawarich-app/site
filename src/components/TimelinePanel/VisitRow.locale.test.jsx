import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import content from '@locale-content/components/VisitRow.json';
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));
vi.mock('@site/src/components/FileUploader', () => ({ default: () => null }));
vi.mock('@site/src/components/PosterStudio/PosterStudioEditor', () => ({ default: () => null }));
vi.mock('@site/src/utils/demoPosterRoute', () => ({ fetchDemoRoutePoints: () => new Promise(() => {}) }));
vi.mock('@docusaurus/BrowserOnly', () => ({ default: ({ fallback }) => fallback ?? null }));

import Subject from './VisitRow';

describe('VisitRow locale content', () => {
  it('renders the English content label', () => {
    render(<Subject entry={{ duration: 1440, pointCount: 2, name: "Visit" }} />);
    expect(screen.getAllByText(content.allDay)[0]).toHaveTextContent(content.allDay);
  });
});
