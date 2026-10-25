import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@docusaurus/useDocusaurusContext', async () => {
  const original = await vi.importActual('@docusaurus/useDocusaurusContext');
  return { default: () => {
    const context = original.default();
    return { ...context, i18n: { ...context.i18n, currentLocale: 'de' } };
  } };
});
vi.mock('@site/src/components/FileUploader', () => ({ default: ({ onFilesLoaded }) => (
  <button onClick={() => onFilesLoaded([{
    filename: 'records.json', size: 1280,
    data: { locations: [{ latitudeE7: 525200000, longitudeE7: 134050000, timestamp: '2024-04-14T08:30:00Z' }] },
  }])}>Load fixture</button>
) }));
vi.mock('@site/src/components/RelatedTools', () => ({ default: () => null }));

import TimelineFormatDetector from './timeline-format-detector';

describe('TimelineFormatDetector locale formatting', () => {
  it('preserves fractional file sizes when the locale uses a decimal comma', async () => {
    render(<TimelineFormatDetector />);
    fireEvent.click(screen.getByRole('button', { name: 'Load fixture' }));
    expect(await screen.findByText('1,25 KB')).toBeInTheDocument();
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content', 'https://dawarich.app/de/tools/timeline-format-detector/',
    );
  });
});
